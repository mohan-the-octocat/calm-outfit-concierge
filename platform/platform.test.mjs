import test from 'node:test';
import assert from 'node:assert/strict';
import { parseIntent, validateIntentShape } from './services/intent.mjs';
import { retrieveItems } from './services/retrieval.mjs';
import { computeFulfillmentOptions } from './services/fulfillment.mjs';
import { evaluateSuitability } from './services/suitability.mjs';
import { upsertProfile, getProfile, mergeProfileWithIntent, clearProfile } from './services/profile.mjs';
import { ingestCatalog } from './jobs/catalogIngest.mjs';
import { syncInventory } from './jobs/inventorySync.mjs';
import { loadSla } from './jobs/slaLoader.mjs';

test('intent parsing + moderation', () => {
  const good = parseIntent({ identity: 'Woman', occasion: 'Wedding guest look', vibe: 'Crafted textiles' });
  assert.equal(good.blocked, false);
  assert.equal(validateIntentShape(good.intent), true);

  const bad = parseIntent({ identity: 'violence', occasion: 'x', vibe: 'y' });
  assert.equal(bad.blocked, true);
});

test('retrieval filters and fallback', () => {
  const catalog = [{ id: '1', tag: 'Wedding guest look', vibe: 'Crafted textiles', sizes: ['M'], stores: ['Mumbai'], priceNumeric: 1000, popularity: 10 }];
  const result = retrieveItems({ intent: { occasion: 'Wedding guest look', vibe: 'Crafted textiles' }, filters: { size: 'M' }, catalog });
  assert.equal(result.items.length, 1);
  const fallback = retrieveItems({ intent: {}, filters: {}, catalog, vectorAvailable: false });
  assert.equal(fallback.strategy, 'fallback-popularity');
});

test('fulfillment sorting and cutoff', () => {
  const now = new Date('2024-01-01T21:00:00');
  const options = computeFulfillmentOptions([
    { label: 'Express', etaHours: 8, cutoff: '18:00' },
    { label: 'Pickup', etaHours: 2, cutoff: '23:00' },
  ], now);
  assert.equal(options[0].label, 'Pickup');
  assert.equal(options.find((o) => o.label === 'Express').pastCutoff, true);
});

test('suitability checks', () => {
  const verdict = evaluateSuitability({ occasion: 'Wedding guest look', vibe: 'Crafted textiles' }, { title: 'Ivory saree', description: 'crafted textiles', tag: 'Wedding guest look', vibe: 'Crafted textiles' });
  assert.equal(verdict.suitable, true);
});

test('profile CRUD and merge', () => {
  upsertProfile('u1', { identity: 'Woman', budget: 12000 });
  assert.equal(getProfile('u1').identity, 'Woman');
  const merged = mergeProfileWithIntent(getProfile('u1'), { occasion: 'Boardroom ready', vibe: 'Minimal and tailored' }, { budget: 15000 });
  assert.equal(merged.budget, 15000);
  clearProfile('u1');
  assert.equal(getProfile('u1'), null);
});

test('catalog ingest, inventory sync, and SLA loader', () => {
  const ingest = ingestCatalog([{ id: 'p1', title: 'Item', tag: 'Wedding guest look', vibe: 'Crafted textiles', priceNumeric: 1000 }, { id: null }]);
  assert.equal(ingest.loaded, 1);
  assert.equal(ingest.failed, 1);

  const inventory = syncInventory(new Map(), [{ itemId: 'p1', store: 'Mumbai', size: 'M', qty: 2 }, { itemId: 'p2' }]);
  assert.equal(inventory.updated, 1);
  assert.equal(inventory.deadLetter.length, 1);

  const sla = loadSla([{ region: 'IN-W', method: 'express', cutoff: '18:00', etaHours: 8, timezone: 'Asia/Kolkata' }, { region: 'bad' }]);
  assert.equal(sla.loaded, 1);
  assert.equal(sla.failed, 1);
});
