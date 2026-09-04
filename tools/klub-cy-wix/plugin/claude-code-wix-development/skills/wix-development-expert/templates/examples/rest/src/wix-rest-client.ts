export type WixScope =
  | { siteId: string; accountId?: never }
  | { accountId: string; siteId?: never };

export type WixRestClientOptions = WixScope & {
  apiKey: string;
  baseUrl?: string;
};

export class WixRestClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly siteId?: string;
  private readonly accountId?: string;

  constructor(options: WixRestClientOptions) {
    this.baseUrl = (options.baseUrl ?? "https://www.wixapis.com").replace(/\/$/, "");
    this.apiKey = options.apiKey;
    if (options.siteId) {
      this.siteId = options.siteId;
    } else {
      this.accountId = options.accountId;
    }
  }

  async request<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set("Authorization", this.apiKey);
    headers.set("Content-Type", "application/json");
    if (this.siteId) headers.set("wix-site-id", this.siteId);
    if (this.accountId) headers.set("wix-account-id", this.accountId);

    const response = await fetch(`${this.baseUrl}/${path.replace(/^\//, "")}`, {
      ...init,
      headers,
    });

    const text = await response.text();
    const body = text ? JSON.parse(text) : undefined;
    if (!response.ok) {
      throw new Error(
        `Wix API ${response.status} ${response.statusText}: ${JSON.stringify(body)}`,
      );
    }
    return body as T;
  }
}
