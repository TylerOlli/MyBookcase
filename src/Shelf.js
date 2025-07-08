import React from "react";
import Book from "./Book";
import "./App.css";
import { AnimatePresence, motion } from "framer-motion";

class Shelf extends React.Component {
  state = {
    mounted: false,
  };

  render() {
    const { shelf, books } = this.props;
    const shelfTitle = shelf
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, function(str) {
        return str.toUpperCase();
      });
    return (
      <div className='bookshelf'>
        <h2 className='bookshelf-title'>{shelfTitle}</h2>
        <div className='bookshelf-books'>
          <ol className='books-grid'>
            <AnimatePresence>
              {books
                .filter((books) => books.shelf === shelf)
                .map((book) => (
                  <motion.li
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    key={book.id}
                  >
                    <Book
                      onChangeShelf={this.props.onChangeShelf}
                      key={book.id}
                      book={book}
                    />
                  </motion.li>
                ))}
            </AnimatePresence>
          </ol>
        </div>
      </div>
    );
  }
}

export default Shelf;
