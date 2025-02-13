import { useState } from "react";

interface TileProps {
  id: string;
  title: string;
  imageUrl: string;
  onBookmark: (id: string) => void;
}

export default function HoverTile({ id, title, imageUrl, onBookmark }: TileProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative w-64 h-40 rounded-xl overflow-hidden shadow-md cursor-pointer transition-all"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <img
        src={imageUrl}
        alt={title}
        className={`w-full h-full object-cover transition-all duration-300 ${
          hovered ? "brightness-50" : "brightness-100"
        }`}
      />

      {/* Hover Overlay */}
      {hovered && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/60 text-white p-4">
          <p className="text-lg font-semibold">{title}</p>
          <button
            className="mt-2 px-4 py-2 bg-white text-black font-medium rounded-md shadow-md hover:bg-gray-200 transition"
            onClick={() => onBookmark(id)}
          >
            Add to Bookmarks
          </button>
        </div>
      )}
    </div>
  );
}
