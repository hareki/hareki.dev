import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const DIST_HTML = 'dist/client/index.html';
const DIST_HEADERS = 'dist/client/_headers';
const PLACEHOLDER = '__CSP_INLINE_SCRIPT_HASHES__';

const html = readFileSync(DIST_HTML, 'utf-8');

// Match inline <script> tags (no src attribute)
const inlineScriptRegex = /<script(?![^>]*\bsrc\b)[^>]*>([\s\S]*?)<\/script>/gi;
const hashes = [];

let match;
while ((match = inlineScriptRegex.exec(html)) !== null) {
  const content = match[1];
  if (!content.trim()) {
    continue;
  }
  const hash = createHash('sha512').update(content, 'utf-8').digest('base64');
  hashes.push(`'sha512-${hash}'`);
}

if (hashes.length === 0) {
  console.error('No inline scripts found — CSP hash placeholder will be empty');
  process.exit(1);
}

const headers = readFileSync(DIST_HEADERS, 'utf-8');

if (!headers.includes(PLACEHOLDER)) {
  console.error(`Placeholder ${PLACEHOLDER} not found in ${DIST_HEADERS}`);
  process.exit(1);
}

const updated = headers.replace(PLACEHOLDER, hashes.join(' '));
writeFileSync(DIST_HEADERS, updated);

console.log(`CSP: computed ${hashes.length} inline script hash(es)`);
for (const h of hashes) {
  console.log(`  ${h}`);
}
