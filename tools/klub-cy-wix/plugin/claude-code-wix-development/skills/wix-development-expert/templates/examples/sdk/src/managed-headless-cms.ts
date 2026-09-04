import { items } from "@wix/data";

export type CatalogItemView = {
  _id: string;
  name?: string;
  description?: string;
  image?: unknown;
};

export async function loadCatalogItems(
  collectionId = "catalog-items",
): Promise<CatalogItemView[]> {
  try {
    const { items: rows } = await items
      .query(collectionId)
      .ascending("name")
      .limit(50)
      .find();

    return rows.map(({ _id, name, description, image }) => ({
      _id,
      name,
      description,
      image,
    }));
  } catch (error) {
    console.error(`Failed to load ${collectionId}`, error);
    return [];
  }
}
