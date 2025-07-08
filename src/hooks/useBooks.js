import { useState, useEffect, useCallback } from "react";
import * as BooksAPI from "../BooksAPI";

export function useBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    BooksAPI.getAll().then((books) => {
      setBooks(books);
    });
  }, []);

  const changeShelf = useCallback((book, shelf) => {
    if (books) {
      BooksAPI.update(book, shelf).then(() => {
        book.shelf = shelf;
        setBooks((prevBooks) => prevBooks.filter((b) => b.id !== book.id).concat([book]));
      });
    }
  }, [books]);

  return { books, changeShelf };
} 