import {NavLink} from '@remix-run/react';
import {useEffect, useState} from 'react';
import {FaDoorOpen} from 'react-icons/fa';
import {useAuth} from '~/contexts/AuthContext';
import profileIcon from '../assets/profile.png';
import authToken from '../utils/authToken';
import {LoginModal} from './LoginModal';

export const Navbar = () => {
  const {checkToken, removeToken} = authToken();
  const {toggleLoginModalStatus} = useAuth();

  const [isLoggedUser, setIsLoggedUser] = useState(false);

  const links = [
    {
      title: 'Mouse',
      linkTo: '/collections/Mouse',
    },
    {
      title: 'Keyboards',
      linkTo: '/collections/keyboards',
    },
    {
      title: 'Combos',
      linkTo: '/collections/mouse',
    },
    {
      title: 'Headsets',
      linkTo: '/collections/headsets-1',
    },
  ];

  const handleUserLogin = () => {
    toggleLoginModalStatus(true);
  };

  const handleLogoutUser = () => {
    removeToken();
    window.location.reload(); // Its temporary
  };

  useEffect(() => {
    const tokenStatus = checkToken();
    setIsLoggedUser(tokenStatus);
  }, []);

  return (
    <>
      <nav className="row-start-1 row-end-2 w-auto bg-custom-gray h-20 flex justify-center ">
        <div className="flex w-11/12 max-w-screen-xl flex-row justify-between items-center mx-auto">
          <NavLink to="/">
            <h1 className="text-green-500 text-xl font-bold">
              DevMoise's Store
            </h1>
          </NavLink>
          <div className="space-x-4 hidden md:flex ">
            {links.map((item, index) => (
              <NavLink
                key={index}
                className="text-slate-50 hover:text-gray-300 transition duration-300"
                to={item.linkTo}
              >
                {item.title}
              </NavLink>
            ))}
          </div>
          <div className="flex space-x-4 items-center">
            {isLoggedUser ? (
              <>
                <NavLink className="text-center" to={'/favorites'}>
                  <h5 className="text-white">
                    You're logged{' '}
                    <span className="text-blue-500 flex">
                      (Go to favorites)
                    </span>
                  </h5>
                </NavLink>
                <div className="h-10 w-0.5 bg-white "></div>
                <button
                  onClick={handleLogoutUser}
                  className="text-white flex items-center"
                >
                  <span className="mr-2">Logout</span> <FaDoorOpen size={30} />
                </button>
              </>
            ) : (
              <button onClick={handleUserLogin} className="flex items-center">
                <h5 className="text-white mr-4">Login</h5>
                <img src={profileIcon} alt="User Profile" className="h-8 w-8" />
              </button>
            )}
          </div>
        </div>
      </nav>
      <LoginModal />
    </>
  );
};
