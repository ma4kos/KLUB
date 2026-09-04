# KLUB Migration Examples

The transformer requires the path to a local KLUB repository checkout. Display its complete usage without performing work:

```bash
node src/build-klub-payloads.mjs --help
```

Run the payload builder with an explicit source and optional output directory:

```bash
npm run build-payloads -- /path/to/KLUB ./output
```

A missing or unreadable source path exits with status `2` and prints an actionable usage message. The script reads only the four required `src/content/*.json` files and creates deterministic import candidates with stable source identities and record hashes. It does not call Wix or change the source repository. Use the resulting manifest for count review, mapping approval, exact-schema adaptation, and idempotent import code generation.

The collection schema is logical, not an API request. Retrieve current Wix CMS method schemas before creating collections or writing items.
