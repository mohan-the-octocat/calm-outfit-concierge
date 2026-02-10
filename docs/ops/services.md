# Service Layer Implementation Notes

This repository now includes local reference service modules under `platform/services` and ETL job modules under `platform/jobs`.

## Services
- `intent.mjs`: intent parse + moderation gate + schema validation.
- `retrieval.mjs`: semantic+filter ranking and fallback strategy.
- `fulfillment.mjs`: ETA/cutoff computation and fastest-option sorting.
- `suitability.mjs`: suitability guardrail with unsafe filtering.
- `profile.mjs`: profile CRUD and merge/override behavior.

## Jobs
- `catalogIngest.mjs`: validate/upsert rows and embedding placeholder generation.
- `inventorySync.mjs`: atomic-ish key-based updates and dead-letter capture.
- `slaLoader.mjs`: SLA row validation and loading keyed by region+method.

## Validation
- `platform/platform.test.mjs` verifies these units with deterministic fixtures.
