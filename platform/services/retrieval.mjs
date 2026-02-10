export function retrieveItems({ intent, filters = {}, catalog = [], k = 6, vectorAvailable = true }) {
  if (!vectorAvailable) {
    return {
      strategy: 'fallback-popularity',
      items: catalog.slice(0, k).map((item, index) => ({ ...item, score: 1 / (index + 1), availability_confidence: item.availability_confidence ?? 0.5 })),
      message: 'Vector search unavailable; showing fallback picks.',
    };
  }

  const filtered = catalog.filter((item) => {
    if (filters.size && !item.sizes?.includes(filters.size)) return false;
    if (filters.store && !item.stores?.includes(filters.store)) return false;
    if (filters.maxBudget && Number(item.priceNumeric || 0) > Number(filters.maxBudget)) return false;
    if (filters.category && item.category !== filters.category) return false;
    return true;
  });

  const ranked = filtered
    .map((item) => {
      const semanticScore = Number(item.tag === intent.occasion) + Number(item.vibe === intent.vibe);
      const score = semanticScore + Number(item.popularity || 0) * 0.01;
      return { ...item, score, availability_confidence: item.availability_confidence ?? 0.7 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  return { strategy: 'vector+filters', items: ranked, message: null };
}
