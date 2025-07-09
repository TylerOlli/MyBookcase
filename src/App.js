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
  const [showBrowseAll, setShowBrowseAll] = useState(false);
  const [browseResults, setBrowseResults] = useState([]);
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerms, setSearchTerms] = useState(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);

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
      // Merge with existing shelf data and remove duplicates
      const mergedResults = mergeAndDeduplicateBooks(results, books);
      setSearchResults(mergedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchBooks, books]);

  const handleBrowseAll = useCallback(async () => {
    setIsBrowsing(true);
    setShowBrowseAll(true);
    setCurrentSearchIndex(0);
    setHasMoreBooks(true);
    
    try {
      // Start with the first search term
      const results = await searchBooks(searchTerms[0]);
      // Merge with existing shelf data and remove duplicates
      const mergedResults = mergeAndDeduplicateBooks(results, books);
      setBrowseResults(mergedResults);
      setCurrentSearchIndex(1);
    } catch (error) {
      console.error('Browse error:', error);
      setBrowseResults([]);
    } finally {
      setIsBrowsing(false);
    }
  }, [searchBooks, books, searchTerms]);

  const loadMoreBooks = useCallback(async () => {
    if (isLoadingMore || !hasMoreBooks || currentSearchIndex >= searchTerms.length) {
      return;
    }

    setIsLoadingMore(true);
    
    try {
      const newResults = await searchBooks(searchTerms[currentSearchIndex]);
      // Merge with existing shelf data and remove duplicates
      const mergedNewResults = mergeAndDeduplicateBooks(newResults, books);
      
      // Remove duplicates from existing browse results
      const existingIds = new Set(browseResults.map(book => book.id));
      const uniqueNewResults = mergedNewResults.filter(book => !existingIds.has(book.id));
      
      if (uniqueNewResults.length > 0) {
        setBrowseResults(prev => [...prev, ...uniqueNewResults]);
      }
      
      setCurrentSearchIndex(prev => prev + 1);
      
      // Check if we've reached the end of search terms
      if (currentSearchIndex + 1 >= searchTerms.length) {
        setHasMoreBooks(false);
      }
    } catch (error) {
      console.error('Load more error:', error);
      // Continue to next search term even if current one fails
      setCurrentSearchIndex(prev => prev + 1);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMoreBooks, currentSearchIndex, searchTerms, searchBooks, books, browseResults]);

  // Centralized function to merge and deduplicate books
  const mergeAndDeduplicateBooks = useCallback((newBooks, existingBooks) => {
    if (!newBooks || newBooks.length === 0) return [];
    
    // Create a map of existing books by ID for quick lookup
    const existingBooksMap = new Map();
    if (existingBooks && existingBooks.length > 0) {
      existingBooks.forEach(book => {
        existingBooksMap.set(book.id, book);
      });
    }
    
    // Create a map to track processed books and remove duplicates within new results
    const processedBooks = new Map();
    
    return newBooks
      .filter(book => book && book.id) // Filter out invalid books
      .map(book => {
        // Merge with existing shelf data if available
        const existingBook = existingBooksMap.get(book.id);
        return existingBook ? { ...book, shelf: existingBook.shelf } : book;
      })
      .filter(book => {
        // Remove duplicates based on book ID
        if (processedBooks.has(book.id)) {
          return false;
        }
        processedBooks.set(book.id, book);
        return true;
      });
  }, []);

  // Get deduplicated search results
  const getDeduplicatedSearchResults = useCallback(() => {
    const processedBooks = new Map();
    return searchResults.filter(book => {
      if (processedBooks.has(book.id)) {
        return false;
      }
      processedBooks.set(book.id, book);
      return true;
    });
  }, [searchResults]);

  // Get deduplicated browse results
  const getDeduplicatedBrowseResults = useCallback(() => {
    const processedBooks = new Map();
    return browseResults.filter(book => {
      if (processedBooks.has(book.id)) {
        return false;
      }
      processedBooks.set(book.id, book);
      return true;
    });
  }, [browseResults]);

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
      setBrowseResults(prev => prev.filter(b => b.id !== book.id));
    } else {
      // If book is removed from shelf, update the book in results to show no shelf
      setSearchResults(prev => prev.map(b => b.id === book.id ? { ...b, shelf: 'none' } : b));
      setBrowseResults(prev => prev.map(b => b.id === book.id ? { ...b, shelf: 'none' } : b));
    }
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.search-container') && !e.target.closest('.search-dropdown') && !e.target.closest('.browse-all-container')) {
      setShowDropdown(false);
      setIsExpanded(false);
      setShowBrowseAll(false);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const closeBrowseAll = () => {
    setShowBrowseAll(false);
    setBrowseResults([]);
  };

  const handleBrowseScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
    // Load more when user scrolls to 80% of the content
    if (scrollPercentage > 0.8 && !isLoadingMore && hasMoreBooks) {
      loadMoreBooks();
    }
  }, [isLoadingMore, hasMoreBooks, loadMoreBooks]);

  const sortBrowseResults = useCallback((results) => {
    if (!results || results.length === 0) return results;
    
    return [...results].sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'title') {
        aValue = (a.title || '').toLowerCase();
        bValue = (b.title || '').toLowerCase();
      } else if (sortBy === 'author') {
        aValue = (a.authors && a.authors.length > 0 ? a.authors[0] : '').toLowerCase();
        bValue = (b.authors && b.authors.length > 0 ? b.authors[0] : '').toLowerCase();
      } else {
        return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [sortBy, sortOrder]);

  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
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
                          <div className='search-actions'>
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
                            <button 
                              className='browse-all-button'
                              onClick={handleBrowseAll}
                              aria-label='Browse all books'
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="9" y1="9" x2="9" y2="9"></line>
                                <line x1="15" y1="9" x2="15" y2="9"></line>
                                <line x1="9" y1="15" x2="9" y2="15"></line>
                                <line x1="15" y1="15" x2="15" y2="15"></line>
                              </svg>
                              Browse All
                            </button>
                          </div>
                          
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
                                      <span>Found {getDeduplicatedSearchResults().length} book{getDeduplicatedSearchResults().length !== 1 ? 's' : ''}</span>
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
                                      {sortBrowseResults(getDeduplicatedSearchResults()).map((book) => (
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

                        {/* Browse All Container */}
                        <AnimatePresence>
                          {showBrowseAll && (
                            <motion.div
                              className="browse-all-container"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="browse-all-header">
                                <div className="browse-header-left">
                                  <h2>Browse All Books</h2>
                                  {browseResults.length > 0 && (
                                    <div className="browse-progress">
                                      <span className="books-count">{getDeduplicatedBrowseResults().length} books loaded</span>
                                      {hasMoreBooks && (
                                        <span className="loading-status">
                                          {isLoadingMore ? 'Loading more...' : 'Scroll to load more'}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="browse-controls">
                                  <div className="sort-controls">
                                    <span className="sort-label">Sort by:</span>
                                    <button 
                                      className={`sort-button ${sortBy === 'title' ? 'active' : ''}`}
                                      onClick={() => handleSortChange('title')}
                                      aria-label={`Sort by title ${sortBy === 'title' && sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                                    >
                                      Title
                                      {sortBy === 'title' && (
                                        <svg 
                                          width="12" 
                                          height="12" 
                                          viewBox="0 0 24 24" 
                                          fill="none" 
                                          stroke="currentColor" 
                                          strokeWidth="2" 
                                          strokeLinecap="round" 
                                          strokeLinejoin="round"
                                          style={{ transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                                        >
                                          <polyline points="6,9 12,15 18,9"></polyline>
                                        </svg>
                                      )}
                                    </button>
                                    <button 
                                      className={`sort-button ${sortBy === 'author' ? 'active' : ''}`}
                                      onClick={() => handleSortChange('author')}
                                      aria-label={`Sort by author ${sortBy === 'author' && sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                                    >
                                      Author
                                      {sortBy === 'author' && (
                                        <svg 
                                          width="12" 
                                          height="12" 
                                          viewBox="0 0 24 24" 
                                          fill="none" 
                                          stroke="currentColor" 
                                          strokeWidth="2" 
                                          strokeLinecap="round" 
                                          strokeLinejoin="round"
                                          style={{ transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                                        >
                                          <polyline points="6,9 12,15 18,9"></polyline>
                                        </svg>
                                      )}
                                    </button>
                                  </div>
                                  <button 
                                    className="close-browse"
                                    onClick={closeBrowseAll}
                                    aria-label="Close browse all"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="18" y1="6" x2="6" y2="18"></line>
                                      <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              
                              {isBrowsing && (
                                <div className="browse-loading">
                                  <div className="loading-spinner"></div>
                                  <span>Loading books...</span>
                                </div>
                              )}
                              
                              {!isBrowsing && browseResults.length > 0 && (
                                                                  <div className="browse-results" onScroll={handleBrowseScroll}>
                                    {sortBrowseResults(getDeduplicatedBrowseResults()).map((book) => (
                                      <div key={book.id} className="browse-book-item">
                                        <Book onChangeShelf={handleBookSelect} book={book} />
                                      </div>
                                    ))}
                                  {isLoadingMore && (
                                    <div className="load-more-indicator">
                                      <div className="loading-spinner"></div>
                                      <span>Loading more books...</span>
                                    </div>
                                  )}
                                  {!hasMoreBooks && browseResults.length > 0 && (
                                    <div className="no-more-books">
                                      <span>No more books to load</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

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
