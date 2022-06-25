import slugify from 'slugify';
import { productsCollection } from '../mongo/collections';
import { Product } from '../types';
import { getObjectId } from '../utils';

const insertProduct = async (product: Product, sellerId: string): Promise<Product> => {
  const { cost, name, amount_available } = product;
  const slug = slugify(name, { lower: true });
  const existingSlugsCursor = productsCollection.find({ slug: { $regex: slug } });
  const existingSlugsDocuments = await existingSlugsCursor.toArray();
  const numberOfExistingSlugs = existingSlugsDocuments.length;
  const transformedSlug = numberOfExistingSlugs ? `${slug}-${numberOfExistingSlugs}` : slug;
  const transformedProduct: Product = {
    cost,
    name,
    seller_id: getObjectId(sellerId),
    amount_available,
    slug: transformedSlug,
  };

  const insertResult = await productsCollection.insertOne(transformedProduct);
  const insertedProduct = await productsCollection.findOne({ _id: insertResult.insertedId });

  return insertedProduct as unknown as Product;
};

export { insertProduct };
