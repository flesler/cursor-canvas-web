import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function stripComments(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
}

function parseIndexExports(source: string): {
  values: Set<string>;
  types: Set<string>
} {
  const values = new Set<string>()
  const types = new Set<string>()
  const cleaned = stripComments(source)
  for (const match of cleaned.matchAll(
    /export\s+type\s+\{([^}]+)\}\s+from\s+["'][^"']+["']/g,
  )) {
    for (const part of match[1].split(',')) {
      const name = part.trim().split(/\s+/).pop()
      if (name) {
        types.add(name)
      }
    }
  }
  for (const match of cleaned.matchAll(
    /export\s+\{([^}]+)\}\s+from\s+["'][^"']+["']/g,
  )) {
    for (const part of match[1].split(',')) {
      const bits = part.trim().split(/\s+as\s+/)
      const name = bits[bits.length - 1].trim()
      if (name) {
        values.add(name)
      }
    }
  }
  return { values, types }
}

function parseBarrelExports(source: string): {
  values: Set<string>;
  types: Set<string>
} {
  const values = new Set<string>()
  const types = new Set<string>()
  const cleaned = stripComments(source)

  const reExports = parseIndexExports(cleaned)
  for (const n of reExports.types) {
    types.add(n)
  }
  for (const n of reExports.values) {
    values.add(n)
  }

  for (const match of cleaned.matchAll(
    /export\s+function\s+([A-Za-z0-9_]+)/g,
  )) {
    values.add(match[1])
  }
  for (const match of cleaned.matchAll(
    /export\s+interface\s+([A-Za-z0-9_]+)/g,
  )) {
    types.add(match[1])
  }
  for (const match of cleaned.matchAll(
    /export\s+type\s+([A-Za-z0-9_]+)\s*=/g,
  )) {
    types.add(match[1])
  }
  for (const match of cleaned.matchAll(
    /export\s+type\s+([A-Za-z0-9_]+)\s*</g,
  )) {
    types.add(match[1])
  }

  return { values, types }
}

const argv = process.argv.slice(2)
const strict = argv.includes('--strict')
const positional = argv.filter((a) => a !== '--strict')

const sdkPath =
  positional[0] ?? path.join(root, 'src/vendor/canvas-sdk/index.d.ts')
const forkPath = positional[1] ?? path.join(root, 'src/shim/cursor-canvas.tsx')

if (!fs.existsSync(sdkPath)) {
  console.error(`Missing SDK snapshot: ${sdkPath} (run npm run sync:sdk)`)
  process.exit(1)
}
if (!fs.existsSync(forkPath)) {
  console.error(`Missing shim barrel: ${forkPath}`)
  process.exit(1)
}

const sdk = parseIndexExports(fs.readFileSync(sdkPath, 'utf8'))
const fork = parseBarrelExports(fs.readFileSync(forkPath, 'utf8'))

const missVal = [...sdk.values].filter((n) => !fork.values.has(n)).sort()
const missType = [...sdk.types].filter((n) => !fork.types.has(n)).sort()
const extraVal = [...fork.values].filter((n) => !sdk.values.has(n)).sort()

console.log(
  'SDK value exports missing in fork:',
  missVal.join(', ') || '(none)',
)
console.log(
  'SDK type exports missing in fork:',
  missType.join(', ') || '(none)',
)
console.log(
  'Fork-only value exports (review):',
  extraVal.join(', ') || '(none)',
)

if (strict && (missVal.length > 0 || missType.length > 0)) {
  process.exit(1)
}
