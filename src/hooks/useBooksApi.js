import { useState, useCallback } from "react";
import * as BooksAPI from "../BooksAPI";

export function useBooksApi() {
  const [books, setBooks] = useState([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshBooks = useCallback(() => {
    setInitialLoading(true);
    setError(null);
    BooksAPI.getAll()
      .then((books) => {
        setBooks(books);
        setInitialLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch books.");
        setInitialLoading(false);
      });
  }, []);

  const changeShelf = useCallback((book, shelf) => {
    setActionLoading(true);
    setError(null);
    BooksAPI.update(book, shelf)
      .then(() => {
        book.shelf = shelf;
        setBooks((prevBooks) => prevBooks.filter((b) => b.id !== book.id).concat([book]));
        setActionLoading(false);
      })
      .catch((err) => {
        setError("Failed to update book shelf.");
        setActionLoading(false);
      });
  }, []);

  const searchBooks = useCallback((query) => {
    setActionLoading(true);
    setError(null);
    return BooksAPI.search(query)
      .then((results) => {
        setActionLoading(false);
        if (results.error) {
          return [];
        }
        return results;
      })
      .catch((err) => {
        setError("Failed to search books.");
        setActionLoading(false);
        return [];
      });
  }, []);

  return { books, initialLoading, actionLoading, error, refreshBooks, changeShelf, searchBooks };
} 