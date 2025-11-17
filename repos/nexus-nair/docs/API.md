# Nexus Nair API Documentation

This repository currently does not expose an HTTP API server. This docs scaffold provides a starting OpenAPI v3 specification and human-friendly Markdown you can expand as the project adds server routes.

## Structure
- docs/openapi.yaml — canonical OpenAPI v3 definition  
- docs/API.md — human-friendly documentation and endpoint templates (this file)  
- docs/examples/requests.md — curl / JS examples  
- docs/.spectral.yaml — Spectral configuration for linting  
- .github/workflows/validate-openapi.yml — GitHub Actions workflow to lint and build docs

## Authentication
Common auth schemes included in the OpenAPI spec:
- Bearer JWT (bearerAuth)
- API key in header (X-API-Key)

Example header:

Authorization: Bearer <token>

## Canonical error envelope
All error responses conform to a single envelope:

```json
{
  "error": {
    "code": "INVALID_PAYLOAD",
    "message": "Field `name` is required",
    "details": { "field": "name" },
    "timestamp": "2025-11-14T12:00:00Z",
    "requestId": "uuid"
  }
}
