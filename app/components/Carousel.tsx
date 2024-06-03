import React, {useState} from 'react';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io';
import carouselImage from '../assets/banner.png';

export const Carousel = () => {
  const carouselList = [
    {
      linkTop: '/',
      path: carouselImage,
      altImage: 'Your new gaming chair!',
    },
    {
      linkTop: '/',
      path: carouselImage,
      altImage: 'Your new gaming chair!',
    },
    {
      linkTop: '/',
      path: carouselImage,
      altImage: 'Your new gaming chair!',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselList.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselList.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <div className="relative w-full overflow-hidden">
      <button
        onClick={handlePrev}
        className="p-2 md:p-4 bg-green-400 rounded-full absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 z-10 hover:opacity-70 transition"
      >
        <IoIosArrowBack size={20} color="#000" />
      </button>
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{transform: `translateX(-${currentIndex * 100}%)`}}
      >
        {carouselList.map((item, index) => (
          <div key={index} className="min-w-full">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={item.path}
                alt={item.altImage}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleNext}
        className="p-2 md:p-4 bg-green-400 rounded-full absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 z-10 hover:opacity-70 transition"
      >
        <IoIosArrowForward size={20} color="#000" />
      </button>
    </div>
  );
};
