# Intent Prompt Pack

Model: gpt-4o-mini (default), retry on gpt-4o.

System instruction:
- Extract user intent into strict JSON with keys: identity, occasion, vibe, imageAttributes.
- Never return keys outside schema.
- If uncertain, provide best non-empty guess for required fields.
- Refuse unsafe requests using `{"blocked": true, "reason": "unsafe"}`.

Failure policy:
1. First call with gpt-4o-mini and response_format=json_schema.
2. If schema invalid or empty required field, retry once with gpt-4o.
3. If still invalid, return fallback parser output and mark `fallback=true` in logs.
