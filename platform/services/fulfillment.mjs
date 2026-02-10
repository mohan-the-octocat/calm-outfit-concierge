export function nextEligibleWindow({ cutoff, etaHours }, now = new Date()) {
  const [hour, minute] = cutoff.split(':').map(Number);
  const cutoffTs = new Date(now);
  cutoffTs.setHours(hour, minute, 0, 0);
  const pastCutoff = now > cutoffTs;
  const arrival = new Date(now.getTime() + (etaHours + (pastCutoff ? 24 : 0)) * 60 * 60 * 1000);
  return { pastCutoff, arrival };
}

export function computeFulfillmentOptions(slaOptions = [], now = new Date()) {
  const options = (slaOptions.length ? slaOptions : [{ label: 'Pickup', etaHours: 2, cutoff: '23:59' }]).map((option) => {
    const { pastCutoff, arrival } = nextEligibleWindow(option, now);
    return {
      ...option,
      pastCutoff,
      etaText: pastCutoff ? `${option.label}: next window` : `${option.label}: by ${arrival.toISOString()}`,
      arrivalTs: arrival.getTime(),
    };
  });

  const sorted = options.sort((a, b) => a.arrivalTs - b.arrivalTs).map((option, idx) => ({ ...option, fastest: idx === 0 }));
  return sorted;
}
