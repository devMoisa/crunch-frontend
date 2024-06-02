export const GET_ALL_PRODUCTS_QUERY = `#graphql
query AllProducts() {
  products(first: 20, after:null, sortKey: UPDATED_AT, reverse: true) {
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
        images(first: 1) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
`;
