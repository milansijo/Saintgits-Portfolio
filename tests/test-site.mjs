import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
for (const marker of ['id="story"','id="programs"','id="campus"','id="connect"','id="interest-form"','aria-label="Primary navigation"']) assert.ok(html.includes(marker), `missing ${marker}`);
assert.match(html, /Saintgits College of Engineering/i);
assert.match(html, /<main id="top">/);
console.log('site smoke tests passed');
