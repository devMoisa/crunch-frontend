import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Carousel} from '~/components/Carousel';

import {Categories} from '~/components/Categories';
import {Product} from '~/components/Product';
import {GET_HOME_DATA} from '~/graphql/categories/getAllCategories';
import {productsMapper} from '~/utils/productsMapper';
import bgImage from '../assets/bgHeader.webp';

export const meta: MetaFunction = () => {
  return [{title: 'Crunch Test | Home'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const getHomeInformations = await storefront.query(GET_HOME_DATA);

  return defer({
    getHomeInformations,
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>() as any;

  const allCategories = data.getHomeInformations.collections.edges;
  const allProducts = productsMapper(data.getHomeInformations.products.edges);

  return (
    <>
      <Carousel />
      <div
        style={{backgroundImage: `url(${bgImage})`}}
        className="w-full bg-current bg-center min-h-52"
      >
        <Categories data={allCategories} />
        <h1 className="text-white text-3xl text-center mt-14">Our Products</h1>
        <div className="p-8 md:p-20 flex flex-col md:flex-row justify-between">
          <div className="flex-1 min-h-[100px] flex flex-row flex-wrap justify-center gap-4">
            {allProducts?.map((item: any, index: any) => {
              return <Product data={item} key={index} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
}
