import React from "react";
import PropTypes from "prop-types";
import Book from "./Book";
import "./App.css";
import { AnimatePresence, motion } from "framer-motion";
import { getBooksForShelf } from "./utils/bookUtils";

function Shelf({ shelf, books, onChangeShelf, onDragOver, onDragLeave, onDrop, dragOverShelf, onBookDragStart, onBookDragEnd, draggedBook }) {
  const shelfTitle = shelf
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, function(str) {
      return str.toUpperCase();
    });
  const shelfBooks = getBooksForShelf(books, shelf);

  const getShelfIcon = (shelfName) => {
    const icons = {
      'currentlyReading': '📖',
      'wantToRead': '📚',
      'read': '✅'
    };
    return icons[shelfName] || '📋';
  };

  const isDragOver = dragOverShelf === shelf;

  return (
    <div 
      className={`bookshelf ${isDragOver ? 'drag-over' : ''}`} 
      data-shelf={shelf}
      onDragOver={(e) => {
        console.log('📦 Shelf dragOver event:', shelf);
        onDragOver && onDragOver(e, shelf);
      }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        console.log('📦 Shelf drop event:', shelf);
        onDrop && onDrop(e, shelf);
      }}
    >
      <h2 className='bookshelf-title'>
        <span className="shelf-icon">{getShelfIcon(shelf)}</span>
        {shelfTitle}
        <span className="book-count">({shelfBooks.length})</span>
      </h2>
      <div className='bookshelf-books'>
        {shelfBooks.length === 0 ? (
          <motion.div
            className="empty-shelf"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p>No books in this shelf yet</p>
            <p>Use the search to add some books!</p>
          </motion.div>
        ) : (
          <ol className='books-grid'>
            <AnimatePresence>
              {shelfBooks.map((book) => (
                <motion.li
                  layout
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  draggable={true}
                  onDragStart={(e) => onBookDragStart && onBookDragStart(e, book)}
                  onDragEnd={onBookDragEnd}
                  className={`shelf-book-item ${draggedBook?.id === book.id ? 'dragging' : ''}`}
                >
                  <Book onChangeShelf={onChangeShelf} book={book} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        )}
      </div>
      {isDragOver && (
        <div className="drop-zone-overlay">
          <div className="drop-zone-content">
            <span>Drop here to add to {shelfTitle}</span>
          </div>
        </div>
      )}
    </div>
  );
}

Shelf.propTypes = {
  shelf: PropTypes.string.isRequired,
  books: PropTypes.array.isRequired,
  onChangeShelf: PropTypes.func.isRequired,
  onDragOver: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func,
  dragOverShelf: PropTypes.string,
  onBookDragStart: PropTypes.func,
  onBookDragEnd: PropTypes.func,
  draggedBook: PropTypes.object,
};

export default Shelf;
