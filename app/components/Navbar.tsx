import {NavLink} from '@remix-run/react';
import profileIcon from '../assets/profile.png';
import cartIcon from '../assets/cart.png';
import {useAuth} from '~/contexts/AuthContext';
import {LoginModal} from './LoginModal';

export const Navbar = () => {
  const {toggleLoginModalStatus} = useAuth();

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

  return (
    <>
      <nav className="w-auto bg-custom-gray h-20 flex justify-center ">
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
          <div className="flex space-x-4">
            <button onClick={handleUserLogin}>
              <img src={profileIcon} alt="User Profile" className="h-8 w-8" />
            </button>
            <NavLink to={'/'}>
              <img src={cartIcon} alt="Cart" className="h-8 w-8" />
            </NavLink>
          </div>
        </div>
      </nav>
      <LoginModal />
    </>
  );
};
