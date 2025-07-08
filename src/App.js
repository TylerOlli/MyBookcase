import React, { useState, useEffect, useCallback } from "react";
import * as BooksAPI from "./BooksAPI";
import { Route, Link, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import Shelf from "./Shelf";
import Search from "./Search";

function App() {
  const [books, setBooks] = useState([]);
  const location = useLocation();

  const changeShelf = useCallback((book, shelf) => {
    if (books) {
      BooksAPI.update(book, shelf).then(() => {
        book.shelf = shelf;
        setBooks((prevBooks) => prevBooks.filter((b) => b.id !== book.id).concat([book]));
      });
    }
  }, [books]);

  useEffect(() => {
    BooksAPI.getAll().then((books) => {
      setBooks(books);
    });
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <Routes location={location}>
            <Route
              path='/'
              element={
                <div className='app'>
                  <div className='list-books'>
                    <div className='list-books-title'>
                      <h1>MyBookcase</h1>
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
                    <div className='open-search'>
                      <Link to='/search'>
                        <button>Add a book</button>
                      </Link>
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
