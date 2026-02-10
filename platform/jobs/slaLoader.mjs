export function validateSlaRow(row) {
  return Boolean(row.region && row.method && row.cutoff && row.etaHours != null && row.timezone);
}

export function loadSla(rows, existing = new Map()) {
  let loaded = 0;
  let failed = 0;
  for (const row of rows) {
    if (!validateSlaRow(row)) {
      failed += 1;
      continue;
    }
    existing.set(`${row.region}:${row.method}`, row);
    loaded += 1;
  }
  return { loaded, failed, table: existing };
}
