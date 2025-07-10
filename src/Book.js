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
      'read': 'Read',
      'none': 'None'
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
      <div className='book-top'>
        <div
          className='book-cover'
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${book.imageLinks ? book.imageLinks.thumbnail : ""})`,
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
          
          {/* Current Shelf Status */}
          {currentShelf !== 'none' && (
            <div className='book-shelf-badge' data-shelf={currentShelf}>
              {getShelfDisplayName(currentShelf)}
            </div>
          )}
          
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
