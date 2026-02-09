# PRD: RetailNext Calm Outfit Concierge (Country-Agnostic)

## 1. Summary
A minimal, question-led shopping assistant that collects three intent signals (“I am / I need / I like”), then serves in-stock, event-appropriate outfits with pickup and smart shipping options. Powered by GenAI (GPT-4o), embeddings, and inventory-aware retrieval.

## 2. Goals
- Reduce “couldn’t find in store” negative reviews.
- Increase conversion and pickup/express usage for event-driven shopping.
- Improve inventory efficiency via better sell-through of event-tagged items.

## 3. Non-Goals
- Full cart/checkout implementation.
- Payment orchestration.
- Deep personalization beyond stated intent (no long-term profiles in v1).

## 4. Personas
- Fashion-forward professional: time-poor, wants fast pickup/express.
- Event-bound shopper: needs assurance of availability for a date.
- Stylist/associate: uses tool to assist in-store matching quickly.

## 5. User Stories (v1 scope)
- As a shopper, I answer three quick questions and see 3–6 curated items available near me.
- As a shopper, I can view pickup timing and fastest shipping ETA for each item.
- As a shopper, I can paste a style description or upload an image to “find similar.”
- As an associate, I can filter by store and size to hand a customer ready options.

## 6. Functional Requirements
- Three-step intake: identity, occasion, style vibe (free text + suggestions).
- Optional input: style text or image; parse attributes to enrich intent.
- Catalog retrieval: RAG over product + inventory with availability filters.
- Ranking: occasion + vibe relevance, availability confidence, pickup/ETA priority.
- Smart shipping rail: show pickup, same-day courier (if supported), express, standard with cut-off times.
- Guardrails: validate suitability to occasion and basic safety using GPT-4o + moderation.
- Observability: log queries, selections, and latency (PII-minimal).

## 7. UX Requirements
- Calm, minimal UI; three-step flow then results grid.
- Surface earliest fulfillment (pickup or shipping) above the fold.
- Limit visible recommendations to 3–6 items; allow “see more.”
- Accessible: keyboard focus, aria labels on inputs/buttons.
- Mobile-first responsive layout.

## 8. Data & Integrations
- Inputs: catalog (titles, descriptions, images), inventory by store, shipping SLA tables, store geos.
- Metadata: occasion tags, seasonality, dress code, fabric/comfort, size range, availability confidence.
- Integrations: inventory service, shipping rate/ETA service, geolocation (city/lat-lon) if allowed.

## 9. AI/LLM Requirements
- Models: `gpt-4o` for vision+reasoning; `gpt-4o-mini` for lightweight tasks; `text-embedding-3-large` for retrieval; `omni-moderation-latest` for safety.
- Prompts: structured JSON outputs for intent parsing and match validation; self-check for outfit suitability.
- Latency target: <= 2.5s p95 for intent parse + retrieval + response (excluding image upload time).
- Cost guardrails: use mini model for rewrites/classification; batch embeddings offline.

## 10. Performance & Reliability
- Results response p95 <= 3.5s end-to-end (text flow); <= 5s with image.
- Graceful degradation: if shipping ETA fails, still show pickup; if inventory stale, show “check in store.”
- Caching: short-lived cache for popular intents and static assets.

## 11. Security & Privacy
- Avoid storing raw images long-term; transient processing only.
- PII minimization: city-level location; no exact addresses in v1.
- Follow platform moderation for user input and generated text.

## 12. Success Metrics
- Reduction in “not found”/availability-related negative reviews.
- Conversion lift vs control for event-driven sessions.
- Pickup/express attach rate on recommended items.
- Retrieval quality (human-rated relevance) >= 4/5 for top 3 items.

## 13. Risks & Mitigations
- Stale inventory → frequent inventory sync; display confidence and last-updated time.
- Model hallucination → structured prompts + guardrail validation step.
- Latency from image analysis → optional image path; compress images; use mini model for pre-filtering.
- Shipping ETA variability → show cut-off clocks and ranges; fall back to pickup-first messaging.

## 14. Open Questions
- Which regions/stores participate in same-day courier? SLA data source? 
- Do we support size reservations or only visibility? 
- Do we need multi-language microcopy in v1?

## 15. Milestones (suggested)
- Week 1: Data ingestion + embeddings + simple retrieval API.
- Week 2: Three-step UI wired to API; pickup/shipping rail stubbed.
- Week 3: Guardrail validation + shipping ETA integration; polish UI.
- Week 4: Pilot with 1–2 regions/stores; collect feedback and tune ranking.
