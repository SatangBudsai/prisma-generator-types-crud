import prismaInternals from '@prisma/internals'
import { mkdir, writeFile, rm } from 'fs/promises'
import { join } from 'path'
import glob from 'glob'
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
export default async function generateTypes(schemaPath: string, outputPath: string, useType: boolean = true) {
  const dmmf = await getDMMF({ datamodelPath: schemaPath })
  let typesEntity = distillDMMF(dmmf, false, false, false)
  let typesCreate = distillDMMF(dmmf, true, false, false)
  let typesUpdate = distillDMMF(dmmf, false, true, false)
  let typesDelete = distillDMMF(dmmf, false, false, true)
  typesEntity = convertPrismaTypesToJSTypes(typesEntity, false)
  typesCreate = convertPrismaTypesToJSTypes(typesCreate, true)
  typesUpdate = convertPrismaTypesToJSTypes(typesUpdate, false)
  typesDelete = convertPrismaTypesToJSTypes(typesDelete, false)

  await clearOutputPaths(outputPath)

  for (const model of typesEntity.models) {
    const entityTypeContent = createTypeFileContents(
      model,
      typesEntity.models,
      typesEntity.enums,
      useType,
      false,
      false,
      false
    )
    await writeToFile(entityTypeContent, outputPath, model.name, 'entityType.ts', false)
  }
  for (const model of typesCreate.models) {
    const createTypeContent = createTypeFileContents(
      model,
      typesCreate.models,
      typesCreate.enums,
      useType,
      true,
      false,
      false
    )
    await writeToFile(createTypeContent, outputPath, model.name, 'createType.ts', false)
  }
  for (const model of typesUpdate.models) {
    const updateTypeContent = createTypeFileContents(
      model,
      typesUpdate.models,
      typesUpdate.enums,
      useType,
      false,
      true,
      false
    )
    await writeToFile(updateTypeContent, outputPath, model.name, 'updateType.ts', false)
  }
  for (const model of typesDelete.models) {
    const deleteTypeContent = createTypeFileContents(
      model,
      typesDelete.models,
      typesDelete.enums,
      useType,
      false,
      false,
      true
    )
    await writeToFile(deleteTypeContent, outputPath, model.name, 'deleteType.ts', false)
  }

  for (const enumType of typesEntity.enums) {
    const enumContent = createEnumFileContents(enumType)
    await writeToFile(enumContent, join(outputPath, 'enum'), enumType.name, `index.ts`, true)
  }
}

async function clearOutputPaths(outputPath: string) {
  try {
    const typesPath = join(outputPath, 'types')
    const enumPath = join(outputPath, 'enum')

    // Remove all files under 'types' and 'enum'
    const files = glob.sync(`${typesPath}/**/*.*`).concat(glob.sync(`${enumPath}/**/*.*`))

    for (const file of files) {
      await rm(file, { force: true })
    }

    // Ensure directories exist
    await mkdir(typesPath, { recursive: true })
    await mkdir(enumPath, { recursive: true })
  } catch (error) {
    console.error(`Failed to clear output paths: ${error}`)
  }
}

function distillDMMF(
  dmmf: DMMF.Document,
  isCreateType: boolean,
  isUpdateType: boolean,
  isDeleteType: boolean
): TypeTransfer {
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
            return !f.relationName && !f.isId
          } else if (isUpdateType) {
            return !f.relationName
          } else if (isDeleteType) {
            return f.isId
          } else {
            return true
          }
        })
        .map(f => ({
          name: f.name,
          typeAnnotation: f.type,
          required: f.isRequired && !(isCreateType && f.isId), // Ensure primary keys are not required in createType
          isArray: f.isList,
          hasDefault: f.hasDefaultValue && !(isCreateType && f.isId), // Avoid default values for primary keys in createType
          isPrimaryKey: !isCreateType && f.isId // Primary key only for entityType and updateType
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
  isCreateType: boolean,
  isUpdateType: boolean,
  isDeleteType: boolean
): string {
  const typeNameSuffix = isCreateType
    ? 'CreateType'
    : isUpdateType
    ? 'UpdateType'
    : isDeleteType
    ? 'DeleteType'
    : 'EntityType'
  const imports = createImportStatements(model, allModels, allEnums)
  const fileContents = `// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

${imports}

export ${useType ? 'type' : 'interface'} ${model.name}${typeNameSuffix} ${useType ? '= ' : ''}{
${model.fields
  .map(field => createFieldLine(field, isCreateType, isUpdateType, isDeleteType, allModels, allEnums))
  .join('\n')}
}`
  return fileContents
}

function createEnumFileContents(enumType: Enum): string {
  const enumValues = enumType.values.map(value => `  ${value} = "${value}"`).join(',\n')
  return `// AUTO GENERATED FILE BY prisma-generator-types-crud
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

  const enumImports = uniqueEnumTypes.map(enumName => `import { ${enumName} } from '../../enum/${enumName}'`).join('\n')

  return `${modelImports}${modelImports && enumImports ? '\n' : ''}${enumImports}`
}

function createFieldLine(
  field: Field,
  isCreateType: boolean,
  isUpdateType: boolean,
  isDeleteType: boolean,
  allModels: Model[],
  allEnums: Enum[]
): string {
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

  if (isDeleteType) {
    return `    ${field.name}: ${typeAnnotation},`
  }

  if (isUpdateType) {
    return `    ${field.name}${field.required ? '' : '?'}: ${typeAnnotation}${typeSuffix},`
  }

  return isCreateType
    ? `    ${field.name}${optional}: ${typeAnnotation}${typeSuffix}${nullability},`
    : `    ${field.name}${field.required ? '' : '?'}: ${typeAnnotation}${typeSuffix},`
}

async function writeToFile(contents: string, outputPath: string, modelName: string, fileName: string, isEnum: boolean) {
  try {
    const directoryPath = isEnum ? join(outputPath, modelName) : join(outputPath, 'types', modelName)
    await mkdir(directoryPath, { recursive: true })
    const filePath = join(directoryPath, fileName)
    await writeFile(filePath, contents, {
      encoding: 'utf8'
    })
  } catch (e) {
    console.error(e)
  }
}
