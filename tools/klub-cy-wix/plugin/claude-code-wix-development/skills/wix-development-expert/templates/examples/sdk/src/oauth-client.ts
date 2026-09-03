import { createClient, OAuthStrategy } from "@wix/sdk";
import { productsV3 } from "@wix/stores";

export type StoredTokens = {
  accessToken: { value: string; expiresAt: number };
  refreshToken: { value: string; role: string };
};

export function createVisitorOrMemberClient(
  clientId: string,
  tokens?: StoredTokens,
) {
  return createClient({
    modules: { productsV3 },
    auth: OAuthStrategy({ clientId, tokens }),
  });
}

export async function listVisibleProducts(
  client: ReturnType<typeof createVisitorOrMemberClient>,
) {
  return client.productsV3.queryProducts({
    filter: { visible: { $eq: true } },
    cursorPaging: { limit: 10 },
  });
}
