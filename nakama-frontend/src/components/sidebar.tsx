import { useState, useEffect } from "react";
import { motion } from "framer-motion"; 

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Listen for Escape key press to close the sidebar
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Filters" : "Open Filters"}
        className="fixed top-5 left-5 bg-gray-800 text-white p-2 rounded-md"
      >
        {isOpen ? "Close" : "Filters"}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: isOpen ? 0 : -250 }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-5 shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">Filters</h2>

        {/* Genre Filter */}
        <div className="mb-4">
          <h3 className="font-semibold">Genre</h3>
          <select className="w-full p-2 mt-1 bg-gray-800 border border-gray-600 rounded">
            <option>Action</option>
            <option>Comedy</option>
            <option>Drama</option>
            <option>Horror</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div className="mb-4">
          <h3 className="font-semibold">Rating</h3>
          <input type="range" min="1" max="10" className="w-full" />
        </div>

        {/* Year Filter */}
        <div className="mb-4">
          <h3 className="font-semibold">Year</h3>
          <input type="number" placeholder="2024" className="w-full p-2 bg-gray-800 border border-gray-600 rounded" />
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
