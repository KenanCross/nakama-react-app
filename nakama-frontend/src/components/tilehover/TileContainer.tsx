import { useState } from "react";
import HoverTile from "./Hover.tsx";

export default function TileContainer() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const handleBookmark = (id: string) => {
    if (!bookmarks.includes(id)) {
      setBookmarks([...bookmarks, id]);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {[
        { id: "1", title: "Delicious Pizza", imageUrl: "https://source.unsplash.com/300x200/?pizza" },
        { id: "2", title: "Tasty Burger", imageUrl: "https://source.unsplash.com/300x200/?burger" },
        { id: "3", title: "Fresh Salad", imageUrl: "https://source.unsplash.com/300x200/?salad" }
      ].map((item) => (
        <HoverTile key={item.id} {...item} onBookmark={handleBookmark} />
      ))}

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Bookmarked Items:</h2>
        <ul className="list-disc list-inside text-lg mt-2">
          {bookmarks.map((id) => (
            <li key={id}>Item {id}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
