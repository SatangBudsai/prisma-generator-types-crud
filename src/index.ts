#!/usr/bin/env node

import generateTypes from './generate-types.js'
import { access } from 'fs/promises'
import { constants } from 'fs'
import { exit } from 'process'
import { exec } from 'child_process'

const argv = process.argv.slice(2)

if (argv.length < 1) {
  console.error('Output path is required')
  exit(1)
}

if (argv[0] === 'help' || argv[0] === '--help') {
  console.log(`prisma-generator-types-crud
  Usage: <output path> [prisma schema file]

  Options:
    --useType                   Use type instead of interface
    --prettier                  Format the generated files with Prettier
  `)
  exit(0)
}

const outputPath = argv[0]

let schemaLocation: string
if (argv.length < 2 || argv[1].startsWith('--')) {
  console.log('Looking for schema.prisma')
  try {
    await access('./schema.prisma', constants.R_OK)
    schemaLocation = './schema.prisma'
  } catch {
    try {
      await access('./prisma/schema.prisma', constants.R_OK)
      schemaLocation = './prisma/schema.prisma'
    } catch {
      console.error('Schema file is required and could not be found')
      exit(1)
    }
  }
} else {
  schemaLocation = argv[1]
}

const useType = argv.includes('--useType')
const prettier = argv.includes('--prettier')

try {
  console.log('Generating types...')
  await generateTypes(schemaLocation, outputPath, useType)
  console.log('Done!')

  if (prettier) {
    console.log('Formatting generated types...')
    exec(`npx prettier --write "${outputPath}/**/*.ts"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error formatting files: ${error.message}`)
        exit(1)
      }
      if (stderr) {
        console.error(`Prettier stderr: ${stderr}`)
        exit(1)
      }
      console.log('Files formatted successfully:')
      console.log(stdout)
    })
  }
} catch (e) {
  console.error(e)
  exit(1)
}
