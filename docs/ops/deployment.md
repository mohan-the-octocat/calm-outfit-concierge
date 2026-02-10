# Deployment and CI/CD

## What is implemented
- Docker image build via `Dockerfile` (nginx static hosting).
- Cloud Build pipeline (`cloudbuild.yaml`) for build/push/deploy to Cloud Run.
- Secret Manager wiring example for `OPENAI_API_KEY` via `--set-secrets`.
- GitHub Actions workflow (`.github/workflows/ci.yml`) runs all tests and prompt validation.

## Local validation
```bash
docker build -t calm-outfit-concierge:local .
node --test web/logic.test.mjs
node --test platform/platform.test.mjs
node scripts/validate_prompt_packs.mjs
```

## Health endpoint
- Current container serves static web root (`/`), which is used as healthcheck.
