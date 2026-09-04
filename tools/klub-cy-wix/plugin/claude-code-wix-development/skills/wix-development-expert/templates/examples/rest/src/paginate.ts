export type CursorPage<T> = {
  items: T[];
  pagingMetadata?: {
    cursors?: { next?: string };
    hasNext?: boolean;
  };
};

export async function collectCursorPages<T>(options: {
  fetchPage: (cursor?: string) => Promise<CursorPage<T>>;
  maxPages?: number;
  maxItems?: number;
}): Promise<T[]> {
  const maxPages = options.maxPages ?? 100;
  const maxItems = options.maxItems ?? 10_000;
  const collected: T[] = [];
  let cursor: string | undefined;

  for (let pageNumber = 0; pageNumber < maxPages; pageNumber += 1) {
    const page = await options.fetchPage(cursor);
    collected.push(...page.items);
    if (collected.length >= maxItems) return collected.slice(0, maxItems);

    const next = page.pagingMetadata?.cursors?.next;
    const hasNext = page.pagingMetadata?.hasNext ?? Boolean(next);
    if (!hasNext || !next || next === cursor) return collected;
    cursor = next;
  }

  throw new Error(`Pagination stopped after maxPages=${maxPages}.`);
}
