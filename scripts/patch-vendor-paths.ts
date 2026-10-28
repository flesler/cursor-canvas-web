import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hashCanvasSdkTree } from './hash-canvas-sdk-tree.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const skillRef = path.join(root, 'src/vendor/canvas/SKILL.md')
const sdkDir = path.join(root, 'src/vendor/canvas-sdk')
const manifestPath = path.join(sdkDir, 'manifest.json')

const REPLACEMENTS: [string, string][] = [
	['~/.cursor/skills-cursor/canvas/sdk', '../canvas-sdk'],
	['~/.cursor/skills-cursor/canvas/SKILL.md', '../canvas/SKILL.md'],
]

function patchFile(filePath: string): void {
	let text = fs.readFileSync(filePath, 'utf8')
	let next = text
	for (const [from, to] of REPLACEMENTS) {
		next = next.replaceAll(from, to)
	}
	if (next !== text) {
		fs.writeFileSync(filePath, next)
	}
}

function collectDtsFiles(dir: string, out: string[] = []): string[] {
	for (const name of fs.readdirSync(dir)) {
		const p = path.join(dir, name)
		if (fs.statSync(p).isDirectory()) {
			collectDtsFiles(p, out)
		} else if (name.endsWith('.d.ts')) {
			out.push(p)
		}
	}
	return out
}

function main(): void {
	if (fs.existsSync(skillRef)) {
		patchFile(skillRef)
	}
	for (const file of collectDtsFiles(sdkDir)) {
		patchFile(file)
	}

	const contentHash = hashCanvasSdkTree(sdkDir)
	let manifest: Record<string, string> = {}
	if (fs.existsSync(manifestPath)) {
		manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as Record<string, string>
	}
	manifest.syncedAt = new Date().toISOString().slice(0, 10)
	manifest.sdkSource = manifest.sdkSource ?? '~/.cursor/skills-cursor/canvas/sdk'
	manifest.contentHash = contentHash
	fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

	console.error(`patch-vendor-paths: contentHash=${contentHash}`)
}

main()
