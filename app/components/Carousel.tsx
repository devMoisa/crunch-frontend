import React, {useState} from 'react';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io';
import carouselImage from '../assets/banner.png';

export const Carousel = () => {
  const carouselList = [
    {
      path: carouselImage,
      linkTop: '/',
    },
    {
      path: carouselImage,
      linkTop: '/',
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
    <div className="w-full h-full relative overflow-hidden">
      <button
        onClick={handlePrev}
        className="p-4 bg-green-400 rounded-full absolute top-1/2 left-16 z-10 transform -translate-y-1/2 hover:opacity-70 transition"
      >
        <IoIosArrowBack size={20} color="#000" />
      </button>
      <div
        className="w-full h-full flex transition-transform duration-700 ease-in-out"
        style={{transform: `translateX(-${currentIndex * 100}%)`}}
      >
        {carouselList.map((item, index) => (
          <img
            key={index}
            className="w-full h-full object-cover cursor-pointer"
            src={item.path}
            alt={`Slide ${index}`}
          />
        ))}
      </div>
      <button
        onClick={handleNext}
        className="p-4 bg-green-400 rounded-full absolute top-1/2 right-16 transform -translate-y-1/2 hover:opacity-70 transition"
      >
        <IoIosArrowForward size={20} color="#000" />
      </button>
    </div>
  );
};
