import {useLoaderData} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
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
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

export const loader = async ({context}: LoaderFunctionArgs) => {
  const {storefront} = context;
  const fetchGraphqlData = await storefront.query(RECOMMENDED_PRODUCTS_QUERY);
  return defer({recommendedProducts: fetchGraphqlData});
};

export const useFetchRecommendedProducts = () => {
  return useLoaderData<typeof loader>();
};
