import { useState, useCallback } from "react";
import * as BooksAPI from "../BooksAPI";

export function useBooksApi() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshBooks = useCallback(() => {
    setLoading(true);
    setError(null);
    BooksAPI.getAll()
      .then((books) => {
        setBooks(books);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch books.");
        setLoading(false);
      });
  }, []);

  const changeShelf = useCallback((book, shelf) => {
    setLoading(true);
    setError(null);
    BooksAPI.update(book, shelf)
      .then(() => {
        book.shelf = shelf;
        setBooks((prevBooks) => prevBooks.filter((b) => b.id !== book.id).concat([book]));
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to update book shelf.");
        setLoading(false);
      });
  }, []);

  const searchBooks = useCallback((query) => {
    setLoading(true);
    setError(null);
    return BooksAPI.search(query)
      .then((results) => {
        setLoading(false);
        if (results.error) {
          return [];
        }
        return results;
      })
      .catch((err) => {
        setError("Failed to search books.");
        setLoading(false);
        return [];
      });
  }, []);

  return { books, loading, error, refreshBooks, changeShelf, searchBooks };
} 