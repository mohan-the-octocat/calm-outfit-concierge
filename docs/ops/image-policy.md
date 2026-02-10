# Image Handling Policy

## Signed URL flow
1. Client requests upload URL.
2. Backend returns short-lived signed PUT URL.
3. Client uploads image directly to GCS.
4. Backend processes image by signed read URL and stores only derived attributes.

## Data retention and logging
- Do not log raw image bytes or base64 payloads.
- Log only object key, request id, and processing outcome.
- Configure bucket lifecycle deletion at 24h for transient uploads.

## Security review notes
- Signed URLs must be scoped to object key + short TTL.
- MIME type and extension validation required at upload initiation.
- Virus/malware scan hook can be inserted before processing.
