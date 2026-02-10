import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { parseIntent, validateIntentShape } from '../platform/services/intent.mjs';
import { evaluateSuitability } from '../platform/services/suitability.mjs';

const intentFixtures = JSON.parse(readFileSync(new URL('../prompts/intent/fixtures.json', import.meta.url), 'utf8'));
const suitabilityFixtures = JSON.parse(readFileSync(new URL('../prompts/suitability/fixtures.json', import.meta.url), 'utf8'));

for (const fixture of intentFixtures) {
  const parsed = parseIntent(fixture.expected);
  assert.equal(parsed.blocked, false, `Intent fixture blocked: ${fixture.name}`);
  assert.equal(validateIntentShape(parsed.intent), true, `Invalid schema for ${fixture.name}`);
}

for (const fixture of suitabilityFixtures) {
  const verdict = evaluateSuitability(fixture.intent, { ...fixture.item, title: fixture.item.tag, description: fixture.item.vibe });
  assert.equal(verdict.suitable, fixture.expected.suitable, `Suitability mismatch: ${fixture.name}`);
}

console.log('Prompt pack validation passed');
