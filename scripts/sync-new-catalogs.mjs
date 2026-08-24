#!/usr/bin/env node
// Merges catalogs that exist locally but not on the remote products.json into
// the remote file, without touching catalogs that already exist there (those
// are live-edited through the running app/API and the remote copy is
// authoritative for them). Run as part of deploy.sh instead of a blind
// `rsync --ignore-existing`, which silently drops newly added catalogs.

import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const [, , sshKey, remoteHost, remotePath] = process.argv
if (!sshKey || !remoteHost || !remotePath) {
  console.error('Usage: sync-new-catalogs.mjs <ssh-key> <user@host> <remote-path>')
  process.exit(1)
}

const localPath = resolve(dirname(fileURLToPath(import.meta.url)), '../data/products.json')
const local = JSON.parse(readFileSync(localPath, 'utf8'))

let remote = null
try {
  const raw = execFileSync('ssh', ['-i', sshKey, remoteHost, `cat '${remotePath}'`], { encoding: 'utf8' })
  remote = JSON.parse(raw)
} catch {
  // Remote file doesn't exist yet (first deploy) — seed it below.
}

const merged = remote ? { ...remote } : {}
const addedCatalogs = []
for (const [name, products] of Object.entries(local)) {
  if (!Array.isArray(merged[name])) {
    merged[name] = products
    addedCatalogs.push(name)
  }
}

if (remote && addedCatalogs.length === 0) {
  console.log('Remote already has every local catalog — nothing to sync.')
  process.exit(0)
}

console.log(remote
  ? `Adding missing catalogs to remote: ${addedCatalogs.join(', ')}`
  : 'Remote catalog file not found — seeding it with the full local file.')

const payload = `${JSON.stringify(merged, null, 2)}\n`
const remoteScript = `set -e; mkdir -p "$(dirname '${remotePath}')"; tmp="${remotePath}.$$.tmp"; cat > "$tmp"; mv "$tmp" '${remotePath}'`
execFileSync('ssh', ['-i', sshKey, remoteHost, remoteScript], { input: payload })
console.log('Remote catalog file updated.')
