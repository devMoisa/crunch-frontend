interface Price {
  amount: string;
  currencyCode: string;
}

interface PriceRange {
  minVariantPrice: Price;
}

interface ProductNode {
  id: string;
  title: string;
  handle: string;
  priceRange: PriceRange;
}

interface NodeWrapper {
  node: ProductNode;
}

export function productsMapper(data: NodeWrapper[]): ProductNode[] {
  return data.map((item) => item.node);
}
