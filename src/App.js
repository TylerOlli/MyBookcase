import React from "react";
import { Route, Link, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import Shelf from "./Shelf";
import Search from "./Search";
import { useBooks } from "./hooks/useBooks";

function App() {
  const { books, changeShelf } = useBooks();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
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
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
