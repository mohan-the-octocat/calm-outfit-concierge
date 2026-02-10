# Monitoring and Logging

## Metrics to create
- `api_latency_p95_ms` (text vs image path labels)
- `api_5xx_count`
- `openai_call_failures`
- `etl_inventory_lag_minutes`

## Dashboards
- API overview: p95 latency, throughput, and 5xx rates.
- Model calls: request count, error count, retries.
- ETL freshness: ingest recency and sync lag.

## Alerts
- Latency SLO breach (`p95 > 2500ms` for intent path).
- 5xx error spike (`>2% over 5m`).
- ETL freshness breach (`inventory lag > 30m`).

## Runbook ownership
- Primary owner: Platform on-call.
- Secondary owner: Data platform on-call.
