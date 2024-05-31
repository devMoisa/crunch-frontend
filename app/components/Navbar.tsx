import {NavLink} from '@remix-run/react';
import profileIcon from '../assets/profile.png';
import cartIcon from '../assets/cart.png';

export const Navbar = () => {
  const links = [
    {
      title: 'Mouse',
      linkTo: 'Mouse',
    },
    {
      title: 'Keyboards',
      linkTo: 'Keyboard',
    },
    {
      title: 'Combos',
      linkTo: 'Combos',
    },
    {
      title: 'Gaming Chair',
      linkTo: 'Gaming-Chair',
    },
  ];

  return (
    <nav className="w-auto bg-custom-gray h-16 flex justify-center ">
      <div className="flex w-11/12 max-w-screen-xl flex-row justify-between items-center mx-auto">
        <NavLink to="/">
          <h1 className="text-slate-50 text-xl font-bold">devMoises Store</h1>
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
          <NavLink to={'/'}>
            <img src={profileIcon} alt="User Profile" className="h-8 w-8" />
          </NavLink>
          <NavLink to={'/'}>
            <img src={cartIcon} alt="Cart" className="h-8 w-8" />
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
