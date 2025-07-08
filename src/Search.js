import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Book from "./Book";
import { useBooksApi } from "./hooks/useBooksApi";

function Search({ onChangeShelf, books: shelfBooks }) {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const { loading, error, searchBooks } = useBooksApi();

  const handleSearch = useCallback((query) => {
    if (!query) {
      setQuery("");
      setBooks([]);
    } else {
      setQuery(query.trim());
      searchBooks(query).then((results) => {
        results.forEach((book) => {
          shelfBooks
            .filter((b) => b.id === book.id)
            .forEach((b) => (book.shelf = b.shelf));
        });
        setBooks(results);
      });
    }
  }, [shelfBooks, searchBooks]);

  return (
    <div className='search-books'>
      <div className='search-books-bar'>
        <Link to='/'>
          <button className='close-search' aria-label="Close search" tabIndex={0}>Close</button>
        </Link>
        <div className='search-books-input-wrapper'>
          <input
            onChange={(e) => handleSearch(e.target.value)}
            type='text'
            placeholder='Search by title or author'
            aria-label='Search by title or author'
          />
        </div>
      </div>
      <div className='search-books-results'>
        {loading && <div className="loading">Searching books...</div>}
        {error && <div className="error">{error}</div>}
        <ol className='books-grid'>
          {books.map((book) => (
            <Book
              onChangeShelf={onChangeShelf}
              key={book.id}
              book={book}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Search;
