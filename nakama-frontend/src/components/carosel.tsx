import React, { useState } from "react";
import { motion } from "framer-motion";

const Carousel = () => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const cards = [
    { id: 1, title: "Card 1", content: "This is the first card." },
    { id: 2, title: "Card 2", content: "This is the second card." },
    { id: 3, title: "Card 3", content: "This is the third card." },
    { id: 4, title: "Card 4", content: "This is the fourth card." },
    { id: 5, title: "Card 5", content: "This is the fifth card." },
  ];

  const nextSlide = () => {
    setScrollIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevSlide = () => {
    setScrollIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    );
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded"
      >
        &#8592;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded"
      >
        &#8594;
      </button>

      {/* Carousel Container */}
      <motion.div
        className="overflow-hidden"
        whileTap={{ cursor: "grabbing" }}
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
      >
        <motion.div
          className="flex"
          animate={{ x: -scrollIndex * 100 + "%" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="w-full h-64 bg-gray-700 text-white p-6 flex-shrink-0 rounded-lg mx-2"
            >
              <h3 className="text-2xl font-semibold">{card.title}</h3>
              <p>{card.content}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Carousel;
