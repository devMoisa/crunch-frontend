export const GET_ALL_CATEGORIES = `#graphql 
query GET_CATEGORIES {
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
  }
`;
