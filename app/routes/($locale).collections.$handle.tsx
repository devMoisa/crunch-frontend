import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {getPaginationVariables} from '@shopify/hydrogen';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Product} from '~/components/Product';
import {COLLECTION_QUERY} from '~/graphql/products/ProductItemFragmentQuery';
import wallbg from '../assets/bgHeader.webp';
import bannerHeader from '../assets/categories.jpg';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Crunch Test | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    return redirect('/collections');
  }

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }
  return json({collection});
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${wallbg})`,
      }}
    >
      <img src={bannerHeader} alt="" className="w-full" />
      <h1 className="text-white text-3xl text-center mt-14">
        {collection?.title}
      </h1>
      <div className="p-8 md:p-20 flex flex-col md:flex-row justify-between">
        <div className="flex-1 min-h-[100px] flex flex-row flex-wrap justify-center gap-4">
          {collection.products.nodes.map((item: any, index: any) => {
            return <Product data={item} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
}
