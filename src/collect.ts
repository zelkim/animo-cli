export async function collect<T>(
  iterable: AsyncIterable<T>,
  limit?: number,
): Promise<T[]> {
  const items: T[] = [];
  for await (const item of iterable) {
    items.push(item);
    if (limit !== undefined && items.length >= limit) break;
  }
  return items;
}
