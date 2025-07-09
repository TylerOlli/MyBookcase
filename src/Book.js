import React, { forwardRef } from "react";
import "./App.css";

const Book = forwardRef(({ book, onChangeShelf }, ref) => {
  const updateBook = (shelf) => {
    onChangeShelf(book, shelf);
  };

  return (
    <div className='book' ref={ref}>
      <div className='book-top'>
        <div
          className='book-cover'
          style={{
            width: 128,
            height: 193,
            backgroundImage: `url(${book.imageLinks ? book.imageLinks.thumbnail : ""})`,
          }}
        />
        <div className='book-shelf-changer'>
          <label htmlFor={`shelf-select-${book.id}`} className="visually-hidden">
            Change shelf for {book.title}
          </label>
          <select
            id={`shelf-select-${book.id}`}
            aria-label={`Change shelf for ${book.title}`}
            value={book.shelf}
            onChange={(e) => updateBook(e.target.value)}
          >
            <option value='move' disabled>
              Move to...
            </option>
            <option value='currentlyReading'>Currently Reading</option>
            <option value='wantToRead'>Want to Read</option>
            <option value='read'>Read</option>
            <option value='none'>None</option>
          </select>
        </div>
      </div>
      <div className='book-title'>{book.title}</div>
      <div className='book-authors'>{book.authors}</div>
    </div>
  );
});

export default Book;
