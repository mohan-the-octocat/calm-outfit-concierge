const profileStore = new Map();

export function getProfile(userId) {
  return profileStore.get(userId) || null;
}

export function upsertProfile(userId, profile) {
  const next = { ...(profileStore.get(userId) || {}), ...profile, updatedAt: new Date().toISOString() };
  profileStore.set(userId, next);
  return next;
}

export function clearProfile(userId) {
  profileStore.delete(userId);
  return true;
}

export function mergeProfileWithIntent(profile = {}, intent = {}, overrides = {}) {
  return {
    identity: overrides.identity || intent.identity || profile.identity || 'unknown',
    occasion: overrides.occasion || intent.occasion || profile.occasion || 'unknown',
    vibe: overrides.vibe || intent.vibe || profile.vibe || 'unknown',
    preferredStore: overrides.preferredStore || profile.preferredStore || null,
    budget: overrides.budget || profile.budget || null,
    overrideAudit: Object.keys(overrides),
  };
}
