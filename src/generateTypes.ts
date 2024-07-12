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
 * @param generateInsertionTypes If true, generates types for data to be inserted into a database
 */
export default async function generateTypes(
  schemaPath: string,
  outputPath: string,
  generateDeclarations: boolean = false,
  generateInsertionTypes: boolean = false,
  useType: boolean = false
) {
  const dmmf = await getDMMF({ datamodelPath: schemaPath })
  let types = distillDMMF(dmmf, generateInsertionTypes)
  types = convertPrismaTypesToJSTypes(types, generateInsertionTypes)

  for (const model of types.models) {
    const entityTypeContent = createTypeFileContents(model, useType, generateInsertionTypes, false)
    const createTypeContent = createTypeFileContents(model, useType, generateInsertionTypes, true)
    await writeToFile(entityTypeContent, outputPath, model.name, 'entityType.ts', generateDeclarations)
    await writeToFile(createTypeContent, outputPath, model.name, 'createType.ts', generateDeclarations)
  }
}

function distillDMMF(dmmf: DMMF.Document, generateInsertionTypes: boolean): TypeTransfer {
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
        .filter(f => !(f.relationName && generateInsertionTypes))
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

function convertPrismaTypesToJSTypes(types: TypeTransfer, generateInsertionTypes: boolean): TypeTransfer {
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
  PrismaTypesMap.set('DateTime', generateInsertionTypes ? '(Date | string)' : 'Date')

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
  useType: boolean,
  generateInsertionTypes: boolean,
  isCreateType: boolean
): string {
  const fileContents = `// AUTO GENERATED FILE BY prisma-typegen
// DO NOT EDIT

export ${useType ? 'type' : 'interface'} ${model.name} ${useType ? '= ' : ''}{
${model.fields.map(field => createFieldLine(field, generateInsertionTypes, isCreateType)).join('\n')}
}`
  return fileContents
}

function createFieldLine(field: Field, generateInsertionTypes: boolean, isCreateType: boolean) {
  if (isCreateType) {
    return generateInsertionTypes
      ? `    ${field.name}${field.required && !field.hasDefault ? '' : '?'}: ${field.typeAnnotation}${
          field.isArray ? '[]' : ''
        }${field.required ? '' : ' | null'},`
      : `    ${field.name}${field.required ? '' : '?'}: ${field.typeAnnotation}${field.isArray ? '[]' : ''},`
  } else {
    return `    ${field.name}${field.required ? '' : '?'}: ${field.typeAnnotation}${field.isArray ? '[]' : ''},`
  }
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
