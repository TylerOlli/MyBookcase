import React, { useEffect, useState, useCallback } from "react";
import { Route, Link, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import Shelf from "./Shelf";
import Search from "./Search";
import Book from "./Book";
import Auth from "./components/Auth";
import { useAuth } from "./contexts/AuthContext";
import { useBooksApi } from "./hooks/useBooksApi";
import { search as googleBooksSearch } from "./BooksAPI";
import Explore from "./Explore";
import Home from "./Home";
import MyShelves from "./MyShelves";
import NavBar from "./NavBar";

const GOOGLE_BOOKS_CATEGORIES = [
  "Fiction", "Nonfiction", "Science", "History", "Biography", "Children", "Comics",
  "Computers", "Cooking", "Education", "Health", "Mathematics", "Medical", "Poetry",
  "Psychology", "Religion", "Romance", "Science Fiction", "Self-Help", "Sports", "Travel"
];

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { books, initialLoading, error, refreshBooks, changeShelf, searchBooks } = useBooksApi();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBrowseAll, setShowBrowseAll] = useState(false);
  const [browseResults, setBrowseResults] = useState([]);
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerms, setSearchTerms] = useState(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);
  const [draggedBook, setDraggedBook] = useState(null);
  const [dragOverShelf, setDragOverShelf] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [categoryStartIndex, setCategoryStartIndex] = useState(0);
  const [hasMoreCategoryBooks, setHasMoreCategoryBooks] = useState(true);
  const [isLoadingMoreCategory, setIsLoadingMoreCategory] = useState(false);

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
    
    // Create a map of existing books by book_id (Google Books API ID) for quick lookup
    const existingBooksMap = new Map();
    if (existingBooks && existingBooks.length > 0) {
      existingBooks.forEach(book => {
        const bookId = book.book_id || book.id;
        existingBooksMap.set(bookId, book);
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
    const bookId = book.book_id || book.id;
    
    // Remove from search results if it's now on a shelf
    if (shelf !== 'none') {
      setSearchResults(prev => prev.filter(b => (b.book_id || b.id) !== bookId));
      setBrowseResults(prev => prev.filter(b => (b.book_id || b.id) !== bookId));
    } else {
      // If book is removed from shelf, update the book in results to show no shelf
      setSearchResults(prev => prev.map(b => (b.book_id || b.id) === bookId ? { ...b, shelf: 'none' } : b));
      setBrowseResults(prev => prev.map(b => (b.book_id || b.id) === bookId ? { ...b, shelf: 'none' } : b));
    }
  };

  const handleShowDetails = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBook(null);
  };

  const handleClickOutside = (e) => {
    // Don't handle clicks if modal is open or if clicking on modal elements
    if (showModal || e.target.closest('.modal-overlay') || e.target.closest('.modal-content')) {
      return;
    }
    
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

  // Load more books for the selected category
  const loadMoreCategoryBooks = useCallback(async () => {
    if (!selectedCategory || isLoadingMoreCategory || !hasMoreCategoryBooks) {
      return;
    }

    setIsLoadingMoreCategory(true);
    
    try {
      const newResults = await googleBooksSearch(`subject:${selectedCategory}`, 40, categoryStartIndex, 'relevance');
      
      if (newResults.length === 0) {
        // Try a few more pages before giving up (Google Books API can be inconsistent)
        setCategoryStartIndex(prev => prev + 40);
        
        // Only give up after trying 3 consecutive empty pages
        if (categoryStartIndex > 400) { // After trying 10+ pages
          setHasMoreCategoryBooks(false);
        }
      } else {
        // Remove duplicates from existing category books
        const existingIds = new Set(categoryBooks.map(book => book.id));
        const uniqueNewResults = newResults.filter(book => !existingIds.has(book.id));
        
        if (uniqueNewResults.length > 0) {
          setCategoryBooks(prev => [...prev, ...uniqueNewResults]);
          setCategoryStartIndex(prev => prev + 40);
        } else {
          // If all results were duplicates, try the next page
          setCategoryStartIndex(prev => prev + 40);
          // Don't set hasMoreCategoryBooks to false yet, try a few more pages
          if (categoryStartIndex > 400) { // Only give up after trying 10+ pages
            setHasMoreCategoryBooks(false);
          }
        }
      }
    } catch (error) {
      console.error('❌ Load more category error:', error);
      setHasMoreCategoryBooks(false);
    } finally {
      setIsLoadingMoreCategory(false);
    }
  }, [selectedCategory, isLoadingMoreCategory, hasMoreCategoryBooks, categoryStartIndex, categoryBooks]);

  const handleCategoryScroll = useCallback((e) => {
    // Removed automatic scroll loading to preserve API usage
    // Users will manually click "Load More" button instead
  }, []);

  const sortBrowseResults = useCallback((results) => {
    if (!results || results.length === 0) return results;
    
    return [...results].sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'title') {
        aValue = (a.title || '').toLowerCase();
        bValue = (b.title || '').toLowerCase();
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (sortBy === 'author') {
        aValue = (a.authors && a.authors.length > 0 ? a.authors[0] : '').toLowerCase();
        bValue = (b.authors && b.authors.length > 0 ? b.authors[0] : '').toLowerCase();
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (sortBy === 'rating') {
        aValue = a.averageRating || 0;
        bValue = b.averageRating || 0;
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (sortBy === 'popularity') {
        aValue = a.ratingsCount || 0;
        bValue = b.ratingsCount || 0;
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        return 0;
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

  const handleDragEnd = useCallback(() => {
    setDraggedBook(null);
    setDragOverShelf(null);
  }, []);

  const handleBookDragStart = useCallback((e, book) => {
    console.log('🚀 BOOK DRAG START:', book.title, 'from shelf:', book.shelf);
    setDraggedBook(book);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', book.id);
    e.dataTransfer.setData('application/json', JSON.stringify(book));
    
    // Create a custom drag image
    const dragImage = new Image();
    dragImage.src = book.imageLinks?.thumbnail || '';
    e.dataTransfer.setDragImage(dragImage, 25, 25);
  }, []);

  const handleBookDragEnd = useCallback(() => {
    setDraggedBook(null);
    setDragOverShelf(null);
  }, []);

  // Shelf drag and drop handlers
  const handleShelfDragOver = useCallback((e, shelf) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    console.log('📍 SHELF DRAG OVER:', shelf);
    setDragOverShelf(shelf);
  }, []);

  const handleShelfDragLeave = useCallback((e) => {
    // Only clear if we're leaving the shelf area completely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverShelf(null);
    }
  }, []);

  const handleShelfDrop = useCallback((e, shelf) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 SHELF DROP on shelf:', shelf);
    
    // Get the book ID from the data transfer
    const bookId = e.dataTransfer.getData('text/plain');
    console.log('📖 Book ID from transfer:', bookId);
    
    // Try to get the full book data from JSON
    let bookToMove = null;
    try {
      const bookData = e.dataTransfer.getData('application/json');
      if (bookData) {
        bookToMove = JSON.parse(bookData);
        console.log('✅ Got book from JSON:', bookToMove.title);
      }
    } catch (error) {
      console.log('❌ JSON parse failed:', error);
    }
    
    // If JSON method failed, find the book in the current books array
    if (!bookToMove) {
      console.log('🔍 Searching for book in current books...');
      const currentBook = books.find(book => book.id === bookId);
      if (currentBook) {
        bookToMove = currentBook;
        console.log('✅ Found in current books:', currentBook.title);
      }
    }
    
    if (bookToMove) {
      console.log('🎉 Moving book:', bookToMove.title, 'to shelf:', shelf);
      handleBookSelect(bookToMove, shelf);
    } else {
      console.log('❌ Could not find book to move!');
    }
    
    setDraggedBook(null);
    setDragOverShelf(null);
  }, [books, handleBookSelect]);

  // Handler for category pill click
  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setIsCategoryLoading(true);
    setCategoryStartIndex(0);
    setHasMoreCategoryBooks(true);
    try {
      const results = await googleBooksSearch(`subject:${category}`, 40, 0, 'relevance');
      setCategoryBooks(results);
      setCategoryStartIndex(40); // Next page starts at index 40
    } catch (error) {
      setCategoryBooks([]);
    } finally {
      setIsCategoryLoading(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Show loading screen while auth is initializing
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show auth screen if user is not authenticated
  if (!user) {
    return <Auth />;
  }

  return (
    <>
      <NavBar />
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
                <Route path='/' element={<Home />} />
                <Route path='/explore' element={<Explore />} />
                <Route path='/myshelves' element={
                  <MyShelves
                    books={books}
                    changeShelf={changeShelf}
                    handleShelfDragOver={handleShelfDragOver}
                    handleShelfDragLeave={handleShelfDragLeave}
                    handleShelfDrop={handleShelfDrop}
                    dragOverShelf={dragOverShelf}
                    handleBookDragStart={handleBookDragStart}
                    handleBookDragEnd={handleBookDragEnd}
                    draggedBook={draggedBook}
                    handleShowDetails={handleShowDetails}
                  />
                } />
                <Route
                  path='/search'
                  element={<Search onChangeShelf={changeShelf} books={books} />}
                />
              </Routes>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      {showModal && selectedBook && (
        <BookDetailsModal book={selectedBook} onClose={handleCloseModal} />
      )}
    </>
  );
}

// Modal component
function BookDetailsModal({ book, onClose }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Helper to render stars for averageRating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<span key={i} style={{color: '#fbbf24', fontSize: '1.1em'}}>&#9733;</span>); // full star
      } else if (rating > i - 1) {
        stars.push(<span key={i} style={{color: '#fbbf24', fontSize: '1.1em'}}>&#189;</span>); // half star (optional)
      } else {
        stars.push(<span key={i} style={{color: '#e5e7eb', fontSize: '1.1em'}}>&#9733;</span>); // empty star
      }
    }
    return stars;
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" tabIndex="-1" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close details">&times;</button>
        <div className="modal-book-title">{book.title}</div>
        {book.subtitle && <div className="modal-book-subtitle">{book.subtitle}</div>}
        <div className="modal-book-authors">{book.authors ? book.authors.join(', ') : 'Unknown Author'}</div>
        {book.publisher && <div><b>Publisher:</b> {book.publisher}</div>}
        {book.publishedDate && <div><b>Published:</b> {book.publishedDate}</div>}
        {book.pageCount && <div><b>Pages:</b> {book.pageCount}</div>}
        {book.averageRating && (
          <div className="modal-book-rating">
            <b>Rating:</b> {renderStars(book.averageRating)} <span style={{marginLeft: 6}}>{book.averageRating} / 5</span> {book.ratingsCount && <span>({book.ratingsCount} ratings)</span>}
          </div>
        )}
        {book.categories && <div><b>Categories:</b> {book.categories.join(', ')}</div>}
        {book.description && <div className="modal-book-description">{book.description}</div>}
        {book.industryIdentifiers && book.industryIdentifiers.length > 0 && (
          <div><b>ISBN:</b> {book.industryIdentifiers.map((id) => `${id.type}: ${id.identifier}`).join(', ')}</div>
        )}
        {book.language && <div><b>Language:</b> {book.language.toUpperCase()}</div>}
        {(book.previewLink || book.infoLink) && (
          <div className="modal-links">
            {book.previewLink && <a href={book.previewLink} target="_blank" rel="noopener noreferrer">Preview</a>}
            {book.infoLink && <a href={book.infoLink} target="_blank" rel="noopener noreferrer">More Info</a>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
