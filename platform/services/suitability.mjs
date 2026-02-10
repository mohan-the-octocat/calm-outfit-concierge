const unsafeTerms = ['weapon', 'hate', 'violent'];

export function evaluateSuitability(intent, item) {
  const raw = `${intent.occasion || ''} ${intent.vibe || ''} ${item.title || ''} ${item.description || ''}`.toLowerCase();
  const unsafe = unsafeTerms.some((term) => raw.includes(term));
  if (unsafe) {
    return { suitable: false, reason: 'Unsafe content detected', blocked: true };
  }

  const occasionMatch = item.tag === intent.occasion;
  const vibeMatch = item.vibe === intent.vibe;
  const suitable = occasionMatch || vibeMatch;
  const reason = suitable ? 'Matches occasion or vibe' : 'Does not match requested signals';
  return { suitable, reason, blocked: false };
}

export function filterSuitable(intent, items) {
  return items
    .map((item) => ({ item, verdict: evaluateSuitability(intent, item) }))
    .filter(({ verdict }) => verdict.suitable && !verdict.blocked)
    .map(({ item, verdict }) => ({ ...item, suitability: verdict }));
}
