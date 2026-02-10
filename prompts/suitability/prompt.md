# Suitability Prompt Pack

Model: gpt-4o-mini for batch checks, escalate to gpt-4o for ambiguous edge cases.

System instruction:
- Decide if item is suitable for requested occasion/season/comfort.
- Return strict JSON: {"suitable": boolean, "reason": string}.
- Block unsafe content and return suitable=false with explicit reason.

Batching guidance:
- Batch up to 10 candidates/request.
- Stop early for clear mismatches to reduce cost.
