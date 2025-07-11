import React from "react";
import Shelf from "./Shelf";

function MyShelves({ books, changeShelf, handleShelfDragOver, handleShelfDragLeave, handleShelfDrop, dragOverShelf, handleBookDragStart, handleBookDragEnd, draggedBook, handleShowDetails }) {
  return (
    <div className="list-books-content">
      <Shelf
        shelf={"currentlyReading"}
        books={books}
        onChangeShelf={changeShelf}
        onDragOver={handleShelfDragOver}
        onDragLeave={handleShelfDragLeave}
        onDrop={handleShelfDrop}
        dragOverShelf={dragOverShelf}
        onBookDragStart={handleBookDragStart}
        onBookDragEnd={handleBookDragEnd}
        draggedBook={draggedBook}
        onShowDetails={handleShowDetails}
      />
      <Shelf
        shelf={"wantToRead"}
        books={books}
        onChangeShelf={changeShelf}
        onDragOver={handleShelfDragOver}
        onDragLeave={handleShelfDragLeave}
        onDrop={handleShelfDrop}
        dragOverShelf={dragOverShelf}
        onBookDragStart={handleBookDragStart}
        onBookDragEnd={handleBookDragEnd}
        draggedBook={draggedBook}
        onShowDetails={handleShowDetails}
      />
      <Shelf
        shelf={"read"}
        books={books}
        onChangeShelf={changeShelf}
        onDragOver={handleShelfDragOver}
        onDragLeave={handleShelfDragLeave}
        onDrop={handleShelfDrop}
        dragOverShelf={dragOverShelf}
        onBookDragStart={handleBookDragStart}
        onBookDragEnd={handleBookDragEnd}
        draggedBook={draggedBook}
        onShowDetails={handleShowDetails}
      />
    </div>
  );
}

export default MyShelves; 