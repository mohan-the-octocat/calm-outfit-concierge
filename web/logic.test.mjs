import test from 'node:test';
import assert from 'node:assert/strict';
import { getArrivalLabel, isValidImageUrl, limitHero, sortFulfillment, validateNotify } from './logic.mjs';

test('validates image url formats', () => {
  assert.equal(isValidImageUrl('https://x.com/a.jpg'), true);
  assert.equal(isValidImageUrl('https://x.com/a.txt'), false);
});

test('limits hero cards to two', () => {
  const result = limitHero([{ hero: true }, { hero: true }, { hero: true }]);
  assert.deepEqual(result.map((r) => r.hero), [true, true, false]);
});

test('sorts fulfillment by earliest eligible arrival', () => {
  const now = new Date('2024-01-01T17:00:00');
  const items = [
    { label: 'Express', etaHours: 8, cutoff: '16:00' },
    { label: 'Pickup', etaHours: 2, cutoff: '20:00' },
  ];
  assert.equal(sortFulfillment(items, now)[0].label, 'Pickup');
  assert.match(getArrivalLabel(items[0], now), /next window/);
});

test('notify accepts email or phone', () => {
  assert.equal(validateNotify('test@example.com'), true);
  assert.equal(validateNotify('+919876543210'), true);
  assert.equal(validateNotify('invalid'), false);
});
