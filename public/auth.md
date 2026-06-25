# Authentication Guide for bg-remove

To programmatically access the bg-remove API, AI agents must register for API credentials.

## Agent Registration

1. Navigate to `https://example.com/developer/register`
2. Create an account or sign in.
3. Generate a Client ID and Client Secret in the dashboard.

## Using the API

We support standard OAuth 2.0 Client Credentials flow. 
Discover endpoints via `/.well-known/oauth-authorization-server`.

```bash
curl -X POST https://auth.example.com/oauth2/token \
  -d "grant_type=client_credentials" \
  -u "client_id:client_secret"
```

Use the returned `access_token` as a Bearer token:
`Authorization: Bearer <token>`
