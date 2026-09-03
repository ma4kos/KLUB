import { ApiKeyStrategy, createClient } from "@wix/sdk";
import { productsV3 } from "@wix/stores";

export function createSiteAdminClient(options: {
  apiKey: string;
  siteId: string;
  accountId?: string;
}) {
  return createClient({
    auth: ApiKeyStrategy({
      apiKey: options.apiKey,
      siteId: options.siteId,
      ...(options.accountId ? { accountId: options.accountId } : {}),
    }),
    modules: { productsV3 },
  });
}

export function createAccountAdminClient(options: {
  apiKey: string;
  accountId: string;
}) {
  return createClient({
    auth: ApiKeyStrategy({
      apiKey: options.apiKey,
      accountId: options.accountId,
    }),
  });
}

export async function listVisibleProducts(
  client: ReturnType<typeof createSiteAdminClient>,
) {
  return client.productsV3.queryProducts({
    filter: { visible: { $eq: true } },
    cursorPaging: { limit: 10 },
  });
}
