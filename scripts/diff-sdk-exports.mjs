#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

function parseIndexExports(source) {
  const values = new Set();
  const types = new Set();
  const cleaned = stripComments(source);
  for (const match of cleaned.matchAll(
    /export\s+type\s+\{([^}]+)\}\s+from\s+["'][^"']+["']/g,
  )) {
    for (const part of match[1].split(',')) {
      const name = part.trim().split(/\s+/).pop();
      if (name) {
        types.add(name);
      }
    }
  }
  for (const match of cleaned.matchAll(
    /export\s+\{([^}]+)\}\s+from\s+["'][^"']+["']/g,
  )) {
    for (const part of match[1].split(',')) {
      const bits = part.trim().split(/\s+as\s+/);
      const name = bits[bits.length - 1].trim();
      if (name) {
        values.add(name);
      }
    }
  }
  return { values, types };
}

function parseForkDeclarations(source) {
  const values = new Set();
  const types = new Set();
  for (const line of source.split('\n')) {
    let m = line.match(/^export declare function ([A-Za-z0-9_]+)/);
    if (m) {
      values.add(m[1]);
    }
    m = line.match(/^export (?:declare )?function ([A-Za-z0-9_]+)/);
    if (m) {
      values.add(m[1]);
    }
    m = line.match(/^export interface ([A-Za-z0-9_]+)/);
    if (m) {
      types.add(m[1]);
    }
    m = line.match(/^export type ([A-Za-z0-9_]+)/);
    if (m) {
      types.add(m[1]);
    }
    m = line.match(/^export \{([^}]+)\} from /);
    if (m) {
      for (const part of m[1].split(',')) {
        const bits = part.trim().split(/\s+as\s+/);
        values.add(bits[bits.length - 1].trim());
      }
    }
    m = line.match(/^export type \{([^}]+)\} from /);
    if (m) {
      for (const part of m[1].split(',')) {
        const name = part.trim().split(/\s+/).pop();
        if (name) {
          types.add(name);
        }
      }
    }
  }
  return { values, types };
}

const sdkPath =
  process.argv[2] ??
  path.join(root, 'test/contract/cursor-sdk/index.d.ts');
const forkPath =
  process.argv[3] ?? path.join(root, 'dist/shim/cursor-canvas.d.ts');

if (!fs.existsSync(sdkPath)) {
  console.error(`Missing SDK snapshot: ${sdkPath} (run pnpm run sync:sdk)`);
  process.exit(1);
}
if (!fs.existsSync(forkPath)) {
  console.error(`Missing fork types: ${forkPath} (run pnpm run build:lib)`);
  process.exit(1);
}

const sdk = parseIndexExports(fs.readFileSync(sdkPath, 'utf8'));
const fork = parseForkDeclarations(fs.readFileSync(forkPath, 'utf8'));

const missVal = [...sdk.values].filter((n) => !fork.values.has(n)).sort();
const missType = [...sdk.types].filter((n) => !fork.types.has(n)).sort();
const extraVal = [...fork.values].filter((n) => !sdk.values.has(n)).sort();

console.log('SDK value exports missing in fork:', missVal.join(', ') || '(none)');
console.log('SDK type exports missing in fork:', missType.join(', ') || '(none)');
console.log('Fork-only value exports (review):', extraVal.join(', ') || '(none)');

if (missVal.length || missType.length) {
  process.exit(1);
}

process.exit(0);
