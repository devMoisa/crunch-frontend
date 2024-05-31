import headsetThumb from '../assets/category_headsets.webp';
import mouseThumb from '../assets/category_mouses.webp';
import keyboardsThumb from '../assets/category_keyboards.webp';
import combosThumb from '../assets/category_combos.webp';
import {Link} from '@remix-run/react';

export const Categories = () => {
  const categoriesList = [
    {
      linkTo: '/',
      altImage: 'Headsets',
      thumbnailImage: headsetThumb,
    },
    {
      linkTo: '/',
      altImage: 'Mouses',
      thumbnailImage: mouseThumb,
    },
    {
      linkTo: '/',
      altImage: 'Keyboards',
      thumbnailImage: keyboardsThumb,
    },
    {
      linkTo: '/',
      altImage: 'Combos',
      thumbnailImage: combosThumb,
    },
  ];

  return (
    <div className="w-full flex justify-center pt-10">
      <div className="w-full max-w-screen-xl flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 px-4 md:px-8">
        {categoriesList.map((item, index) => (
          <Link to={item.linkTo} key={index}>
            <img
              alt={item.altImage}
              src={item.thumbnailImage}
              className="transition hover:opacity-80"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
