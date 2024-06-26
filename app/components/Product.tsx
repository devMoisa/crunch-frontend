import {Link} from '@remix-run/react';
import {useState} from 'react';
import {FaPlus} from 'react-icons/fa';
import {FaCartShopping} from 'react-icons/fa6';
import {IoMdStar} from 'react-icons/io';
import {MdOutlineStarBorder} from 'react-icons/md';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {api} from '~/api/api';
import {useAuth} from '~/contexts/AuthContext';
import authToken from '~/utils/authToken';

export const Product = ({data}: any) => {
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
        name: data.title,
        idShopify: data.id,
        userId: userInfo?.id,
      });

      toast.success('Product saved.');
      setIsFavorite(!isFavorite);
    } catch (error) {}
  };

  return (
    <>
      <div className="relative w-full sm:w-1/2 md:w-1/2 lg:w-1/4 min-w-80 min-h-10 p-5 bg-black bg-opacity-70 hover:bg-gray-700 hover:bg-opacity-30 rounded flex flex-col hover:border-2 hover:border-green-400 hover:border-solid transition cursor-pointer">
        {isFavorite ? (
          <button onClick={handleIsFavorite} className="absolute top-2 right-2">
            <IoMdStar size={35} color="orange" />
          </button>
        ) : (
          <button onClick={handleIsFavorite} className="absolute top-2 right-2">
            <MdOutlineStarBorder size={35} color="orange" />
          </button>
        )}

        <Link to={`/products/${data?.handle}`}>
          <h2 className="text-white mb-5 text-center uppercase mt-8">
            {data?.title}
          </h2>
          <img src={data?.featuredImage?.url} alt="" className="mx-auto" />
          <h3 className="text-green-500 text-3xl font-bold mt-5 text-center">
            R$ {data?.priceRange?.minVariantPrice?.amount}
          </h3>
          <h5 className="text-green-500 text-sm mt-2 text-center">
            Product in <b className="text-green-300">PROMOTION</b> don't miss
            out!
          </h5>
          <div className="flex flex-row mt-5 justify-between items-center">
            <div className="flex p-5 bg-black border-2 border-orange-400 border-solid text-orange-500 font-medium items-center">
              <FaPlus />
              <h5 className="ml-3">MORE DETAILS</h5>
            </div>
            <div className="flex p-4 bg-green-400 border-2 border-green-400 border-solid text-white font-medium rounded items-center">
              <FaCartShopping size={20} />
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};
