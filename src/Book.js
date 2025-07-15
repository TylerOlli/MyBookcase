import React, { forwardRef, useState } from "react";
import "./App.css";

const Book = forwardRef(({ book, onChangeShelf, isDragging, onShowDetails, isBrowseView, isFeatured }, ref) => {
  const [imageError, setImageError] = useState(false);
  
  const updateBook = (shelf) => {
    onChangeShelf(book, shelf);
  };

  const getShelfDisplayName = (shelf) => {
    const shelfNames = {
      'currentlyReading': 'Currently Reading',
      'wantToRead': 'Want to Read',
      'read': 'Read'
    };
    return shelfNames[shelf] || 'Move to...';
  };

  const getShelfIcon = (shelf) => {
    const icons = {
      'currentlyReading': '📖',
      'wantToRead': '📚',
      'read': '✅',
      'none': '📋'
    };
    return icons[shelf] || '📋';
  };

  const currentShelf = book.shelf || 'none';

  // Function to get a placeholder book cover based on title
  const getPlaceholderCover = (title) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    ];
    
    // Use title to generate consistent color
    const colorIndex = title.length % colors.length;
    return colors[colorIndex];
  };

  const hasValidImage = book.imageLinks?.thumbnail || book.image_url;
  const shouldShowPlaceholder = !hasValidImage || imageError || book.customCover;

  return (
    <div 
      className={`book ${isDragging ? 'dragging' : ''}`}
      ref={ref}
    >
      {/* Remove Button (only if on a shelf, not in browse view, and not a featured book) */}
      {currentShelf !== 'none' && !isBrowseView && !isFeatured && (
        <button
          className="remove-book-btn top-right"
          onClick={() => updateBook('none')}
          aria-label={`Remove ${book.title} from shelf`}
          title="Remove from shelf"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      )}
      <div className='book-top'>
        {shouldShowPlaceholder ? (
          <div
            className='book-cover'
            style={{
              width: '100%',
              height: '100%',
              background: book.customCover || getPlaceholderCover(book.title),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              textAlign: 'center',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '600',
              lineHeight: '1.2',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}
          >
            {book.title}
          </div>
        ) : (
          <div
            className='book-cover'
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${book.imageLinks?.thumbnail || book.image_url})`,
            }}
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className='book-info'>
        <div className='book-title'>{book.title}</div>
        <div className='book-authors'>
          {book.authors ? book.authors.join(', ') : 'Unknown Author'}
        </div>
        {/* Quick Action Buttons */}
        <div className='book-actions'>
          <button 
            className="book-details-btn"
            onClick={() => onShowDetails && onShowDetails(book)}
            aria-label={`Show details for ${book.title}`}
          >
            Details
          </button>
          <div className="shelf-actions">
            <button 
              className={`shelf-action-btn ${currentShelf === 'currentlyReading' ? 'active' : ''}`}
              onClick={() => updateBook(currentShelf === 'currentlyReading' ? 'none' : 'currentlyReading')}
              aria-label={currentShelf === 'currentlyReading' ? 'Remove from Currently Reading' : 'Add to Currently Reading'}
              title="Currently Reading"
            >
              📖
            </button>
            <button 
              className={`shelf-action-btn ${currentShelf === 'wantToRead' ? 'active' : ''}`}
              onClick={() => updateBook(currentShelf === 'wantToRead' ? 'none' : 'wantToRead')}
              aria-label={currentShelf === 'wantToRead' ? 'Remove from Want to Read' : 'Add to Want to Read'}
              title="Want to Read"
            >
              📚
            </button>
            <button 
              className={`shelf-action-btn ${currentShelf === 'read' ? 'active' : ''}`}
              onClick={() => updateBook(currentShelf === 'read' ? 'none' : 'read')}
              aria-label={currentShelf === 'read' ? 'Remove from Read' : 'Add to Read'}
              title="Read"
            >
              ✅
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

Book.displayName = 'Book';

export default Book;
