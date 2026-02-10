# Calm Outfit Concierge

A lightweight, intent-led shopping assistant demo for **RetailNext**. It guides shoppers through three calm prompts (`I am`, `I need`, `I like`) and returns curated, in-stock outfit recommendations with fulfillment timing (pickup/shipping), promo context, and suitability guardrails.

This repository includes:
- A static web experience (`web/`) for intake and results UI.
- Local service and jobs modules (`platform/`) that model intent parsing, retrieval, fulfillment ranking, suitability checks, profile behavior, and batch ingest/sync flows.
- Prompt packs (`prompts/`) with schema + fixtures and a validation script.
- CI and deployment definitions for containerized hosting on Cloud Run.

## Why this project exists

The solution targets retail pain points documented in the product docs:
- reduce “couldn’t find in store” outcomes,
- improve conversion for event-driven shopping,
- surface fastest fulfillment (pickup/express) clearly,
- keep the flow simple and low-noise.

## Key capabilities

- **3-step intent intake**: structured prompts for identity, occasion, and vibe.
- **Inventory-aware recommendations**: sample catalog includes store + size availability fields.
- **Fulfillment prioritization**: pickup/shipping options sorted by earliest practical arrival and cut-off handling.
- **Suitability checks**: guardrail logic to confirm occasion/vibe fit.
- **Profile helpers**: merge profile defaults with session intent and inline overrides.
- **Prompt pack validation**: fixture-driven checks for intent and suitability packs.
- **Cloud-ready packaging**: Docker + Cloud Build + Cloud Run deployment pipeline.

## Repository structure

```text
.
├── web/                        # Static UI demo (HTML/CSS/JS + tests)
├── platform/
│   ├── services/               # Intent, retrieval, fulfillment, suitability, profile
│   ├── jobs/                   # Catalog ingest, inventory sync, SLA load
│   └── platform.test.mjs       # Service/job unit tests
├── prompts/
│   ├── intent/                 # Prompt, schema, fixtures
│   └── suitability/            # Prompt, schema, fixtures
├── scripts/
│   └── validate_prompt_packs.mjs
├── docs/                       # PRD, architecture, solution, stories, ops notes
├── Dockerfile
├── cloudbuild.yaml
└── .github/workflows/ci.yml
```

## Quick start

### 1) Prerequisites

- Node.js 20+ (Node 20 is used in CI).
- Optional: Docker (for containerized run).

### 2) Run tests and prompt validation

```bash
node --test web/logic.test.mjs
node --test platform/platform.test.mjs
node scripts/validate_prompt_packs.mjs
```

### 3) Run the web demo locally

Because the UI is static, you can serve `web/` from any static server.

Using Python:

```bash
python3 -m http.server 8080 --directory web
```

Then open: `http://localhost:8080`

## Run with Docker

Build and run:

```bash
docker build -t calm-outfit-concierge:local .
docker run --rm -p 8080:80 calm-outfit-concierge:local
```

Open: `http://localhost:8080`

## CI checks

GitHub Actions runs three checks on push and pull request:

1. Frontend logic tests (`web/logic.test.mjs`)
2. Platform/service tests (`platform/platform.test.mjs`)
3. Prompt pack validation (`scripts/validate_prompt_packs.mjs`)

## Deployment (Cloud Run)

`cloudbuild.yaml` defines build, push, and deploy steps:

1. Build container image.
2. Push image to Artifact Registry.
3. Deploy to Cloud Run with unauthenticated access.
4. Wire `OPENAI_API_KEY` from Secret Manager via `--set-secrets`.

Default substitutions include:
- service: `calm-outfit-concierge`
- region: `us-central1`
- image path under Artifact Registry.

## Product and architecture docs

For deeper context, start with:

- `docs/PRD.md`
- `docs/Architecture.md`
- `docs/Solution.md`
- `docs/stories.md`
- `docs/ops/` (deployment/networking/monitoring/service notes)

## Notes

- The current app is intentionally lightweight and demo-oriented.
- Service and job modules are local reference implementations that support deterministic testing.
- The container health check targets `/` from the static nginx host.
