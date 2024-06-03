import {MetaFunction} from '@shopify/remix-oxygen';
import {useEffect, useState} from 'react';
import {api} from '~/api/api';
import authToken from '~/utils/authToken';
import {ToastContainer, toast} from 'react-toastify';

export const meta: MetaFunction = () => {
  return [{title: 'Crunch Test | Favorites'}];
};

export default function Favorites() {
  const [list, setList] = useState([]) as any;
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const {getDecodedToken} = authToken();
  const user = getDecodedToken();

  const fetchList = async (page = pageNumber) => {
    try {
      const response = await api.get(
        `/api/favorites?pageNumber=${page}&pageSize=${pageSize}&userId=${user?.id}`,
      );

      const data = response.data;

      setList(data.items);
      setTotalItems(data.totalItems);
      setTotalPages(data.totalPages);
      setPageNumber(data.pageNumber);
    } catch (error) {
      console.log('Error', error);
      toast.error('Sorry something went wrong', {
        position: 'bottom-right',
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await api.delete(
        `/api/favorite?productId=${productId}&userId=${user?.id}`,
      );
      toast.success('Product deleted successfully', {
        position: 'bottom-right',
      });
      fetchList(pageNumber);
    } catch (error) {
      console.error('Failed to delete product', error);
      toast.error('Failed to delete product', {
        position: 'bottom-right',
      });
    }
  };

  useEffect(() => {
    fetchList();
  }, [pageNumber]);

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  return (
    <>
      <div className="text-white pl-20 pr-20 pt-10">
        <h1 className="text-white text-2xl mb-5">Products saved</h1>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Product Name
                </th>
                <th scope="col" className="px-6 py-3">
                  idShopify
                </th>
                <th scope="col" className="px-6 py-3">
                  idDatabase
                </th>
                <th scope="col" className="px-6 py-3">
                  userId
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((item: any) => (
                <tr
                  key={item.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.name}
                  </th>
                  <td className="px-6 py-4">{item.idShopify}</td>
                  <td className="px-6 py-4">{item.id}</td>
                  <td className="px-6 py-4">{item.userId}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteProduct(item.id);
                      }}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <nav className="flex justify-center mt-10">
        <ul className="flex items-center -space-x-px h-10 text-base">
          {Array.from({length: totalPages}, (_, index) => index + 1).map(
            (page) => (
              <li key={page}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  className={`flex items-center justify-center px-4 h-10 ${
                    page === pageNumber
                      ? 'z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
                >
                  {page}
                </a>
              </li>
            ),
          )}
        </ul>
      </nav>

      <ToastContainer />
    </>
  );
}
