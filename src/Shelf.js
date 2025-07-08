import React from "react";
import PropTypes from "prop-types";
import Book from "./Book";
import "./App.css";
import { AnimatePresence, motion } from "framer-motion";
import { getBooksForShelf } from "./utils/bookUtils";

function Shelf({ shelf, books, onChangeShelf }) {
  const shelfTitle = shelf
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, function(str) {
      return str.toUpperCase();
    });
  const shelfBooks = getBooksForShelf(books, shelf);
  return (
    <div className='bookshelf'>
      <h2 className='bookshelf-title'>{shelfTitle}</h2>
      <div className='bookshelf-books'>
        <ol className='books-grid'>
          <AnimatePresence>
            {shelfBooks.map((book) => (
              <motion.li
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Book onChangeShelf={onChangeShelf} book={book} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </div>
    </div>
  );
}

Shelf.propTypes = {
  shelf: PropTypes.string.isRequired,
  books: PropTypes.array.isRequired,
  onChangeShelf: PropTypes.func.isRequired,
};

export default Shelf;
