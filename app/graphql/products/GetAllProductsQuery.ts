export const GET_ALL_PRODUCTS_QUERY = `#graphql
query GET_ALL_PRODUCTS() {
  products(first: 20) {
    edges {
      node {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
  }
`;
