import React, { useEffect, useState, useCallback } from "react";
import { Route, Link, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import Shelf from "./Shelf";
import Search from "./Search";
import Book from "./Book";
import { useBooksApi } from "./hooks/useBooksApi";

function App() {
  const { books, initialLoading, error, refreshBooks, changeShelf, searchBooks } = useBooksApi();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    refreshBooks();
  }, [refreshBooks]);

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      setIsExpanded(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);
    
    try {
      const results = await searchBooks(query.trim());
      // Merge with existing shelf data
      const mergedResults = results.map(book => {
        const existingBook = books.find(b => b.id === book.id);
        return existingBook ? { ...book, shelf: existingBook.shelf } : book;
      });
      setSearchResults(mergedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchBooks, books]);

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const handleBookSelect = (book, shelf) => {
    changeShelf(book, shelf);
    // Remove from search results if it's now on a shelf
    if (shelf !== 'none') {
      setSearchResults(prev => prev.filter(b => b.id !== book.id));
    }
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.search-container') && !e.target.closest('.search-dropdown')) {
      setShowDropdown(false);
      setIsExpanded(false);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <main id="main-content" role="main" tabIndex={-1} aria-labelledby="app-title">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {error && <div className="error" role="alert" aria-live="assertive">{error}</div>}
            {!error && (
              <Routes location={location}>
                <Route
                  path='/'
                  element={
                    <div className='app'>
                      <div className='list-books'>
                        <div className='list-books-title'>
                          <h1>MyBookcase</h1>
                        </div>
                        <div className='search-container'>
                          <form onSubmit={handleSearchSubmit} className='search-form'>
                            <div className='search-input-wrapper'>
                              <input
                                type='text'
                                placeholder='Search for books by title or author...'
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                aria-label='Search for books'
                                className='search-input'
                                autoComplete="off"
                              />
                              <button type='submit' className='search-button' aria-label='Search books'>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="11" cy="11" r="8"></circle>
                                  <path d="m21 21-4.35-4.35"></path>
                                </svg>
                              </button>
                            </div>
                          </form>
                          
                          {/* Search Dropdown */}
                          <AnimatePresence>
                            {showDropdown && (
                              <motion.div
                                className={`search-dropdown ${isExpanded ? 'expanded' : ''}`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                              >
                                {isSearching && (
                                  <div className="dropdown-loading">
                                    <div className="loading-spinner"></div>
                                    <span>Searching...</span>
                                  </div>
                                )}
                                
                                {!isSearching && searchQuery && searchResults.length === 0 && (
                                  <div className="dropdown-no-results">
                                    <p>No books found for "{searchQuery}"</p>
                                    <p>Try searching for a different title or author</p>
                                  </div>
                                )}
                                
                                {!isSearching && searchResults.length > 0 && (
                                  <>
                                    <div className="dropdown-header">
                                      <span>Found {searchResults.length} book{searchResults.length !== 1 ? 's' : ''}</span>
                                      <div className="dropdown-controls">
                                        <button 
                                          className="expand-toggle"
                                          onClick={toggleExpanded}
                                          aria-label={isExpanded ? "Collapse results" : "Expand results"}
                                        >
                                          <svg 
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                                          >
                                            <polyline points="6,9 12,15 18,9"></polyline>
                                          </svg>
                                        </button>
                                        {isExpanded && (
                                          <button 
                                            className="close-expanded"
                                            onClick={() => {
                                              setShowDropdown(false);
                                              setIsExpanded(false);
                                            }}
                                            aria-label="Close search results"
                                          >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                              <line x1="18" y1="6" x2="6" y2="18"></line>
                                              <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                    <div className="dropdown-results">
                                      {searchResults.map((book) => (
                                        <div key={book.id} className="dropdown-book-item">
                                          <Book onChangeShelf={handleBookSelect} book={book} />
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <div className='list-books-content'>
                          <Shelf
                            shelf={"currentlyReading"}
                            books={books}
                            onChangeShelf={changeShelf}
                          />
                          <Shelf
                            shelf={"wantToRead"}
                            books={books}
                            onChangeShelf={changeShelf}
                          />
                          <Shelf
                            shelf={"read"}
                            books={books}
                            onChangeShelf={changeShelf}
                          />
                        </div>
                      </div>
                    </div>
                  }
                />
                <Route
                  path='/search'
                  element={<Search onChangeShelf={changeShelf} books={books} />}
                />
              </Routes>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;
