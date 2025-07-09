import React, { useState, useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Book from "./Book";
import { useBooksApi } from "./hooks/useBooksApi";

function Search({ onChangeShelf, books: shelfBooks }) {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const { loading, error, searchBooks } = useBooksApi();
  const [searchParams] = useSearchParams();

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

  // Handle initial query from URL
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setQuery(urlQuery);
      handleSearch(urlQuery);
    }
  }, [searchParams, handleSearch]);

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
            placeholder='Search by title or author...'
            aria-label='Search by title or author'
            value={query}
          />
        </div>
      </div>
      <div className='search-books-results'>
        {loading && (
          <div className="loading" role="status" aria-live="polite">
            <div className="loading-spinner"></div>
            Searching books...
          </div>
        )}
        {error && (
          <div className="error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}
        {!loading && !error && query && books.length === 0 && (
          <div className="no-results">
            <p>No books found for "{query}"</p>
            <p>Try searching for a different title or author</p>
          </div>
        )}
        {!loading && !error && query && books.length > 0 && (
          <div className="search-results-info">
            <p>Found {books.length} book{books.length !== 1 ? 's' : ''} for "{query}"</p>
          </div>
        )}
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
