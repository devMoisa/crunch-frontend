import {
  Await,
  Link,
  useLoaderData,
  type FetcherWithComponents,
  type MetaFunction,
} from '@remix-run/react';
import {
  CartForm,
  Money,
  VariantSelector,
  getSelectedProductOptions,
  type VariantOption,
} from '@shopify/hydrogen';
import type {
  CartLineInput,
  SelectedOption,
} from '@shopify/hydrogen/storefront-api-types';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense, useState} from 'react';
import type {
  ProductFragment,
  ProductVariantFragment,
  ProductVariantsQuery,
} from 'storefrontapi.generated';
import {getVariantUrl} from '~/lib/variants';
import bgImage from '../assets/bgHeader.webp';
import authToken from '~/utils/authToken';
import {useAuth} from '~/contexts/AuthContext';
import {toast} from 'react-toastify';
import {api} from '~/api/api';
import {IoMdStar} from 'react-icons/io';
import {MdOutlineStarBorder} from 'react-icons/md';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Crunch Test | ${data?.product.title ?? ''}`}];
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions: getSelectedProductOptions(request)},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  return defer({product, variants});
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const {product, variants} = useLoaderData<typeof loader>();
  const {selectedVariant} = product;

  return (
    <div className="relative p-5 bg-black text-white flex flex-col items-center">
      <div
        style={{
          backgroundImage: `url(${bgImage})`,
          opacity: 0.2,
        }}
        className="absolute inset-0 bg-no-repeat bg-cover bg-center"
      ></div>
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-cente mt-10 mb-16">
          {product.title}
        </h1>
        <div className="flex flex-col lg:flex-row w-1/2 h-full">
          <ProductImage image={selectedVariant?.image} />
          <div className="lg:ml-10 flex-1">
            <ProductMain
              selectedVariant={selectedVariant}
              product={product}
              variants={variants}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductImage({image}: {image: ProductVariantFragment['image']}) {
  if (!image) {
    return <div className="product-image bg-gray-200 h-64 w-full" />;
  }
  return (
    <div className="flex justify-center mb-8 lg:mb-0 pt-5 bg-black bg-opacity-70 hover:bg-gray-700 rounded flex-col border-2 border-green-400 border-solid transition cursor-pointer">
      <img
        key={image.id}
        src={image.url}
        className="h-auto w-full max-w-md rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        alt={image.altText || 'Product Image'}
      />
    </div>
  );
}

function ProductMain({
  selectedVariant,
  product,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery>;
}) {
  const {title, descriptionHtml, id} = product;
  const {checkToken, getDecodedToken} = authToken();
  const {toggleLoginModalStatus} = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const handleIsFavorite = async () => {
    if (checkToken() === false) {
      toggleLoginModalStatus(true);
      toast('Sorry you need to be logged to favorite.');
      return;
    }

    try {
      const userInfo = getDecodedToken();
      await api.post('/api/favorite', {
        name: title,
        idShopify: id,
        userId: userInfo?.id,
      });

      toast.success('Product saved.');
      setIsFavorite(!isFavorite);
    } catch (error) {}
  };

  return (
    <div className="product-main">
      <ProductPrice selectedVariant={selectedVariant} />
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
            />
          )}
        </Await>
      </Suspense>
      <p className="font-bold mt-5 mb-2">Description</p>
      <div
        dangerouslySetInnerHTML={{__html: descriptionHtml}}
        className="text-gray-300"
      />
      <button
        onClick={handleIsFavorite}
        className="mt-5 w-full bg-transparent text-orange-400 p-5 border-2 border-orange-400 border-solid cursor-pointer flex items-center justify-center hover:opacity-50 transition
      "
      >
        <span className="mr-2">Add to Favorite</span>
        {isFavorite ? (
          <IoMdStar size={35} color="orange" />
        ) : (
          <MdOutlineStarBorder size={35} color="orange" />
        )}
      </button>
    </div>
  );
}

function ProductPrice({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
}) {
  return (
    <div className="product-price mb-4">
      {selectedVariant?.compareAtPrice ? (
        <>
          <p className="text-red-500">Sale</p>
          <br />
          <div className="product-price-on-sale flex items-baseline space-x-2">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s className="text-gray-500">
              <Money data={selectedVariant.compareAtPrice} />
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money data={selectedVariant?.price} />
      )}
    </div>
  );
}

function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  return (
    <div className="product-form">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <br />
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          window.location.href = window.location.href + '#cart-aside';
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                },
              ]
            : []
        }
        className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="product-options mb-4" key={option.name}>
      <h5 className="text-lg font-semibold mb-2">{option.name}</h5>
      <div className="product-options-grid grid grid-cols-3 gap-2">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className={`product-options-item p-2 border rounded ${
                isActive ? 'border-black' : 'border-transparent'
              } ${isAvailable ? 'opacity-100' : 'opacity-30'}`}
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  className,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: CartLineInput[];
  onClick?: () => void;
  className?: string;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className={className}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
