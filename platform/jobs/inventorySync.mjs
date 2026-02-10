export function syncInventory(current = new Map(), deltas = []) {
  const deadLetter = [];
  for (const delta of deltas) {
    if (!delta.itemId || !delta.store || !delta.size) {
      deadLetter.push({ delta, reason: 'missing_keys' });
      continue;
    }
    const key = `${delta.itemId}:${delta.store}:${delta.size}`;
    current.set(key, {
      qty: Number(delta.qty || 0),
      availability_confidence: delta.availability_confidence ?? 0.8,
      last_updated: delta.last_updated || new Date().toISOString(),
    });
  }

  return { updated: deltas.length - deadLetter.length, deadLetter, table: current };
}
