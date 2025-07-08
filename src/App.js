import React, { useEffect } from "react";
import { Route, Link, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import Shelf from "./Shelf";
import Search from "./Search";
import { useBooksApi } from "./hooks/useBooksApi";

function App() {
  const { books, loading, error, refreshBooks, changeShelf } = useBooksApi();
  const location = useLocation();

  useEffect(() => {
    refreshBooks();
  }, [refreshBooks]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {loading && <div className="loading">Loading books...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && (
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
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
