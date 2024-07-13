import prismaInternals from '@prisma/internals'
import { mkdir, writeFile, rm } from 'fs/promises'
import { join } from 'path'
import type { DMMF } from '@prisma/generator-helper'
const { getDMMF } = prismaInternals

interface TypeTransfer {
  models: Model[]
  enums: Enum[]
}

interface Model {
  name: string
  fields: Field[]
}

interface Field {
  name: string
  typeAnnotation: string
  required: boolean
  isArray: boolean
  hasDefault: boolean
  isPrimaryKey: boolean
}

interface Enum {
  name: string
  values: string[]
}

/**
 * @param schemaPath Path to Prisma schema file
 * @param outputPath Path to output directory
 * @param generateDeclarations Whether to just generate type declarations or to generate a full TypeScript file
 * @param useType Use type instead of interface
 */
export default async function generateTypes(
  schemaPath: string,
  outputPath: string,
  generateDeclarations: boolean = false,
  useType: boolean = true
) {
  const dmmf = await getDMMF({ datamodelPath: schemaPath })
  let typesEntity = distillDMMF(dmmf, false)
  let typesCreate = distillDMMF(dmmf, true)
  typesEntity = convertPrismaTypesToJSTypes(typesEntity, false)
  typesCreate = convertPrismaTypesToJSTypes(typesCreate, true)

  await clearOutputPaths(outputPath, typesEntity.models, typesCreate.models)

  for (const model of typesEntity.models) {
    const entityTypeContent = createTypeFileContents(model, typesEntity.models, typesEntity.enums, useType, false)
    await writeToFile(entityTypeContent, outputPath, model.name, 'entityType.ts', generateDeclarations)
  }
  for (const model of typesCreate.models) {
    const createTypeContent = createTypeFileContents(model, typesCreate.models, typesCreate.enums, useType, true)
    await writeToFile(createTypeContent, outputPath, model.name, 'createType.ts', generateDeclarations)
  }

  for (const model of typesEntity.models) {
    for (const enumType of typesEntity.enums) {
      if (model.fields.some(field => field.typeAnnotation === enumType.name)) {
        const enumContent = createEnumFileContents(enumType)
        await writeToFile(
          enumContent,
          join(outputPath, 'enum'),
          enumType.name,
          `${enumType.name}.ts`,
          generateDeclarations
        )
      }
    }
  }
}

async function clearOutputPaths(outputPath: string, entityModels: Model[], createModels: Model[]) {
  try {
    const models = [...new Set([...entityModels.map(m => m.name), ...createModels.map(m => m.name)])]
    for (const modelName of models) {
      const modelPath = join(outputPath, modelName)
      await rm(modelPath, { recursive: true, force: true })
      await mkdir(modelPath, { recursive: true })
    }
    const enumPath = join(outputPath, 'enum')
    await rm(enumPath, { recursive: true, force: true })
    await mkdir(enumPath, { recursive: true })
  } catch (error) {
    console.error(`Failed to clear output paths: ${error}`)
  }
}

function distillDMMF(dmmf: DMMF.Document, isCreateType: boolean): TypeTransfer {
  const types: TypeTransfer = {
    models: [],
    enums: []
  }

  dmmf.datamodel.enums.forEach(prismaEnum => {
    types.enums.push({
      name: prismaEnum.name,
      values: prismaEnum.values.map(e => e.name)
    })
  })

  dmmf.datamodel.models.forEach(model => {
    types.models.push({
      name: model.name,
      fields: model.fields
        .filter(f => {
          if (isCreateType) {
            // Exclude relations and primary keys for createType
            return !f.relationName && !f.isId
          } else {
            // Include all fields for entityType
            return true
          }
        })
        .map(f => ({
          name: f.name,
          typeAnnotation: f.type,
          required: f.isRequired && !(isCreateType && f.isId), // Ensure primary keys are not required in createType
          isArray: f.isList,
          hasDefault: f.hasDefaultValue && !(isCreateType && f.isId), // Avoid default values for primary keys in createType
          isPrimaryKey: !isCreateType && f.isId // Primary key only for entityType
        }))
    })
  })

  return types
}

function convertPrismaTypesToJSTypes(types: TypeTransfer, isCreateType: boolean): TypeTransfer {
  const PrismaTypesMap = new Map([
    ['String', 'string'],
    ['Boolean', 'boolean'],
    ['Int', 'number'],
    ['BigInt', 'number'],
    ['Float', 'number'],
    ['Decimal', 'number'],
    ['Json', 'any'],
    ['Bytes', 'Buffer']
  ])
  PrismaTypesMap.set('DateTime', isCreateType ? '(Date | string)' : 'Date')

  const models = types.models.map(model => {
    const fields = model.fields.map(field => ({
      ...field,
      typeAnnotation: PrismaTypesMap.get(field.typeAnnotation) || field.typeAnnotation
    }))

    return {
      ...model,
      fields
    }
  })

  return {
    ...types,
    models
  }
}

function createTypeFileContents(
  model: Model,
  allModels: Model[],
  allEnums: Enum[],
  useType: boolean,
  isCreateType: boolean
): string {
  const typeNameSuffix = isCreateType ? 'CreateType' : 'EntityType'
  const imports = createImportStatements(model, allModels, allEnums)
  const fileContents = `// AUTO GENERATED FILE BY prisma-typegen
// DO NOT EDIT

${imports}

export ${useType ? 'type' : 'interface'} ${model.name}${typeNameSuffix} ${useType ? '= ' : ''}{
${model.fields.map(field => createFieldLine(field, isCreateType, allModels, allEnums)).join('\n')}
}`
  return fileContents
}

function createEnumFileContents(enumType: Enum): string {
  const enumValues = enumType.values.map(value => `  ${value} = "${value}"`).join(',\n')
  return `// AUTO GENERATED FILE BY prisma-typegen
// DO NOT EDIT

export enum ${enumType.name} {
${enumValues}
}`
}

function createImportStatements(model: Model, allModels: Model[], allEnums: Enum[]): string {
  const relatedModels = model.fields
    .filter(field => allModels.some(m => m.name === field.typeAnnotation))
    .map(field => field.typeAnnotation)

  const enumTypes = model.fields
    .filter(field => allEnums.some(e => e.name === field.typeAnnotation))
    .map(field => field.typeAnnotation)

  const uniqueRelatedModels = [...new Set(relatedModels)]
  const uniqueEnumTypes = [...new Set(enumTypes)]

  const modelImports = uniqueRelatedModels
    .map(modelName => `import { ${modelName}EntityType } from '../${modelName}/entityType'`)
    .join('\n')

  const enumImports = uniqueEnumTypes
    .map(enumName => `import { ${enumName} } from '../enum/${enumName}/${enumName}.ts'`)
    .join('\n')

  return `${modelImports}${modelImports && enumImports ? '\n' : ''}${enumImports}`
}

function createFieldLine(field: Field, isCreateType: boolean, allModels: Model[], allEnums: Enum[]): string {
  const typeSuffix = field.isArray ? '[]' : ''
  const nullability = field.required ? '' : ' | null'
  const optional = field.required && !field.hasDefault ? '' : '?'

  // Check if the field type is a relation to another model
  const isRelation = allModels.some(model => model.name === field.typeAnnotation)
  const isEnum = allEnums.some(enumType => enumType.name === field.typeAnnotation)
  const typeAnnotation = isRelation
    ? `${field.typeAnnotation}EntityType`
    : isEnum
    ? `${field.typeAnnotation}`
    : field.typeAnnotation

  return isCreateType
    ? `    ${field.name}${optional}: ${typeAnnotation}${typeSuffix}${nullability},`
    : `    ${field.name}${field.required ? '' : '?'}: ${typeAnnotation}${typeSuffix},`
}

async function writeToFile(
  contents: string,
  outputPath: string,
  modelName: string,
  fileName: string,
  generateDeclarations: boolean
) {
  try {
    const directoryPath = join(outputPath, modelName)
    await mkdir(directoryPath, { recursive: true })
    const filePath = join(directoryPath, fileName)
    await writeFile(filePath, contents, {
      encoding: 'utf8'
    })
  } catch (e) {
    console.error(e)
  }
}
