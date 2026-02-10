export const intentSchema = {
  required: ['identity', 'occasion', 'vibe'],
  optional: ['imageAttributes', 'safety'],
};

const unsafeTerms = ['violence', 'hate', 'self-harm'];

export function moderateInput(text = '') {
  const lowered = text.toLowerCase();
  const flagged = unsafeTerms.some((term) => lowered.includes(term));
  return { flagged, reason: flagged ? 'unsafe_content' : null };
}

export function parseIntent(payload) {
  const moderation = moderateInput(`${payload.identity || ''} ${payload.occasion || ''} ${payload.vibe || ''}`);
  if (moderation.flagged) {
    return { blocked: true, moderation, intent: null };
  }

  const intent = {
    identity: payload.identity?.trim() || 'unknown',
    occasion: payload.occasion?.trim() || 'unknown',
    vibe: payload.vibe?.trim() || 'unknown',
    imageAttributes: payload.imageUrl ? ['image_reference_provided'] : [],
    safety: { flagged: false },
    model: payload.useMini ? 'gpt-4o-mini' : 'gpt-4o',
  };

  return { blocked: false, moderation, intent };
}

export function validateIntentShape(intent) {
  return intentSchema.required.every((key) => typeof intent[key] === 'string' && intent[key].length > 0);
}
