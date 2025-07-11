import React, { forwardRef } from "react";
import "./App.css";

const Book = forwardRef(({ book, onChangeShelf, isDragging, onShowDetails }, ref) => {
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

  return (
    <div 
      className={`book ${isDragging ? 'dragging' : ''}`}
      ref={ref}
    >
      {/* Remove Button (only if on a shelf) */}
      {currentShelf !== 'none' && (
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
        <div
          className='book-cover'
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${book.imageLinks?.thumbnail || book.image_url || ""})`,
          }}
        />
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
