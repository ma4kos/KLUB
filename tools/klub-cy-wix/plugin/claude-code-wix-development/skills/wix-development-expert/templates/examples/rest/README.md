# Wix REST Examples

The REST wrapper enforces either site scope or account scope and adds the current Wix header names. Supply the endpoint path and request body only after retrieving the exact current method schema. The pagination helper is intentionally endpoint-agnostic because Wix API paging shapes and request fields must be confirmed per method.

Keep the API key in server-side environment variables. Never instantiate this client in browser-delivered code.
