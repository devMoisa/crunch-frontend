import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Carousel} from '~/components/Carousel';

import {Categories} from '~/components/Categories';
import {GET_ALL_CATEGORIES} from '~/graphql/categories/getAllCategories';
import bgImage from '../assets/bgHeader.webp';

export const meta: MetaFunction = () => {
  return [{title: 'Crunch Test | Home'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const allCategories = await storefront.query(GET_ALL_CATEGORIES);

  return defer({
    allCategories: allCategories.collections.edges,
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <Carousel />
      <div
        style={{backgroundImage: `url(${bgImage})`}}
        className="w-full bg-no-repeat bg-cover bg-center min-h-52"
      >
        <Categories data={data.allCategories} />
      </div>
    </>
  );
}
