import React, { useState, useCallback } from "react";
import Book from "./Book";
import { search as googleBooksSearch } from "./BooksAPI";

const GOOGLE_BOOKS_CATEGORIES = [
  "Fiction", "Nonfiction", "Science", "History", "Biography", "Children", "Comics",
  "Computers", "Cooking", "Education", "Health", "Mathematics", "Medical", "Poetry",
  "Psychology", "Religion", "Romance", "Science Fiction", "Self-Help", "Sports", "Travel"
];

function Explore() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [categoryStartIndex, setCategoryStartIndex] = useState(0);
  const [hasMoreCategoryBooks, setHasMoreCategoryBooks] = useState(true);
  const [isLoadingMoreCategory, setIsLoadingMoreCategory] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [sortOrder, setSortOrder] = useState('desc');

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

  // Load more books for the selected category
  const loadMoreCategoryBooks = useCallback(async () => {
    if (!selectedCategory || isLoadingMoreCategory || !hasMoreCategoryBooks) {
      return;
    }

    setIsLoadingMoreCategory(true);
    
    try {
      const newResults = await googleBooksSearch(`subject:${selectedCategory}`, 40, categoryStartIndex, 'relevance');
      if (newResults.length === 0) {
        setCategoryStartIndex(prev => prev + 40);
        if (categoryStartIndex > 400) {
          setHasMoreCategoryBooks(false);
        }
      } else {
        const existingIds = new Set(categoryBooks.map(book => book.id));
        const uniqueNewResults = newResults.filter(book => !existingIds.has(book.id));
        if (uniqueNewResults.length > 0) {
          setCategoryBooks(prev => [...prev, ...uniqueNewResults]);
          setCategoryStartIndex(prev => prev + 40);
        } else {
          setCategoryStartIndex(prev => prev + 40);
          if (categoryStartIndex > 400) {
            setHasMoreCategoryBooks(false);
          }
        }
      }
    } catch (error) {
      setHasMoreCategoryBooks(false);
    } finally {
      setIsLoadingMoreCategory(false);
    }
  }, [selectedCategory, isLoadingMoreCategory, hasMoreCategoryBooks, categoryStartIndex, categoryBooks]);

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
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  return (
    <div className="browse-all-container">
      <div className="browse-all-header">
        <div className="browse-header-left">
          <h2>Explore Books</h2>
          {selectedCategory ? (
            <div className="browse-progress">
              <span className="books-count">{categoryBooks.length} books loaded for {selectedCategory}</span>
              {hasMoreCategoryBooks && (
                <span className="loading-status">
                  Click "Load More" to get additional books
                </span>
              )}
            </div>
          ) : null}
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
            <button 
              className={`sort-button ${sortBy === 'rating' ? 'active' : ''}`}
              onClick={() => handleSortChange('rating')}
              aria-label={`Sort by rating ${sortBy === 'rating' && sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              Rating
              {sortBy === 'rating' && (
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
              className={`sort-button ${sortBy === 'popularity' ? 'active' : ''}`}
              onClick={() => handleSortChange('popularity')}
              aria-label={`Sort by popularity ${sortBy === 'popularity' && sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              Popularity
              {sortBy === 'popularity' && (
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
        </div>
      </div>
      <div className="browse-category-pills">
        {GOOGLE_BOOKS_CATEGORIES.map(category => (
          <button
            key={category}
            className={`category-pill${selectedCategory === category ? ' selected' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {!isCategoryLoading && selectedCategory && (
        <div className="browse-results">
          {isCategoryLoading ? (
            <div className="browse-loading"><div className="loading-spinner"></div>Loading books...</div>
          ) : (
            <>
              {sortBrowseResults(categoryBooks).map((book) => (
                <div key={book.id} className="browse-book-item">
                  <Book book={book} isBrowseView={true} />
                </div>
              ))}
              {hasMoreCategoryBooks && (
                <div className="load-more-section">
                  <button 
                    className="load-more-button"
                    onClick={loadMoreCategoryBooks}
                    disabled={isLoadingMoreCategory}
                  >
                    {isLoadingMoreCategory ? (
                      <>
                        <div className="loading-spinner"></div>
                        Loading...
                      </>
                    ) : (
                      'Load More Books'
                    )}
                  </button>
                </div>
              )}
              {!hasMoreCategoryBooks && categoryBooks.length > 0 && (
                <div className="no-more-books">
                  All available books loaded ({categoryBooks.length} total)
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Explore; 