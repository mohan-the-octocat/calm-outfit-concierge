export function validateCatalogRow(row) {
  return Boolean(row.id && row.title && row.tag && row.vibe && row.priceNumeric != null);
}

export function ingestCatalog(rows, existing = new Map()) {
  let loaded = 0;
  let failed = 0;

  for (const row of rows) {
    if (!validateCatalogRow(row)) {
      failed += 1;
      continue;
    }
    const embedding = [row.title.length % 10, row.vibe.length % 10, row.tag.length % 10];
    existing.set(row.id, { ...row, embedding, upsertedAt: new Date().toISOString() });
    loaded += 1;
  }

  return { loaded, failed, total: rows.length, table: existing };
}
