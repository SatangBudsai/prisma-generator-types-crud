// generateTypes.ts
import prismaInternals from '@prisma/internals'
import { mkdir, writeFile } from 'fs/promises'
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
  useType: boolean = false
) {
  const dmmf = await getDMMF({ datamodelPath: schemaPath })
  let typesEntity = distillDMMF(dmmf, false)
  let typesCreate = distillDMMF(dmmf, true)
  typesEntity = convertPrismaTypesToJSTypes(typesEntity, false)
  typesCreate = convertPrismaTypesToJSTypes(typesCreate, true)

  for (const model of typesEntity.models) {
    const entityTypeContent = createTypeFileContents(model, typesEntity.models, useType, false)
    await writeToFile(entityTypeContent, outputPath, model.name, 'entityType.ts', generateDeclarations)
  }
  for (const model of typesCreate.models) {
    const createTypeContent = createTypeFileContents(model, typesCreate.models, useType, true)
    await writeToFile(createTypeContent, outputPath, model.name, 'createType.ts', generateDeclarations)
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
        .filter(f => !(f.relationName && isCreateType))
        .map(f => ({
          name: f.name,
          typeAnnotation: f.type,
          required: f.isRequired,
          isArray: f.isList,
          hasDefault: f.hasDefaultValue
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

function createTypeFileContents(model: Model, allModels: Model[], useType: boolean, isCreateType: boolean): string {
  const typeNameSuffix = isCreateType ? 'CreateType' : 'EntityType'
  const imports = createImportStatements(model, allModels)
  const fileContents = `// AUTO GENERATED FILE BY prisma-typegen
// DO NOT EDIT

${imports}

export ${useType ? 'type' : 'interface'} ${model.name}${typeNameSuffix} ${useType ? '= ' : ''}{
${model.fields.map(field => createFieldLine(field, isCreateType, allModels)).join('\n')}
}`
  return fileContents
}

function createImportStatements(model: Model, allModels: Model[]): string {
  const relatedModels = model.fields
    .filter(field => allModels.some(m => m.name === field.typeAnnotation))
    .map(field => field.typeAnnotation)

  const uniqueRelatedModels = [...new Set(relatedModels)]

  return uniqueRelatedModels
    .map(modelName => `import { ${modelName}EntityType } from '../${modelName}/entityType'`)
    .join('\n')
}

function createFieldLine(field: Field, isCreateType: boolean, allModels: Model[]): string {
  const typeSuffix = field.isArray ? '[]' : ''
  const nullability = field.required ? '' : ' | null'
  const optional = field.required && !field.hasDefault ? '' : '?'

  // Check if the field type is a relation to another model
  const isRelation = allModels.some(model => model.name === field.typeAnnotation)
  const typeAnnotation = isRelation ? `${field.typeAnnotation}EntityType` : field.typeAnnotation

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
