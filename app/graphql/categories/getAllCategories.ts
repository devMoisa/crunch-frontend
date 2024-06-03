export const GET_HOME_DATA = `#graphql 
query GET_HOME_DATA {
    collections(first: 4) {
      edges {
        node {
          id
          title
          handle
          image {
            url
          }
        }
      }
    }
    products(first: 20) {
    edges {
      node {
        id
        title
        handle
        featuredImage{
            url
        }
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
