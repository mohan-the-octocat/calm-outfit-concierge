# Networking (VPC, NAT, Armor)

## Baseline design
- Cloud Run egress through Serverless VPC Access connector.
- Private DB connectivity over private IP only.
- Cloud NAT for controlled outbound internet egress.
- Optional Cloud Armor policy with baseline rate limit rule.

## Terraform-like checklist
1. Create VPC connector in same region as Cloud Run service.
2. Attach Cloud Run service to connector with all-traffic egress.
3. Ensure DB instance has public IP disabled.
4. Create Cloud Armor policy with IP-based rate limiting.
5. Verify egress path by probing OpenAI endpoint and private DB from Cloud Run runtime.
