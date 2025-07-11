import { useState, useCallback } from "react";
import * as BooksAPI from "../BooksAPI";
import { bookService } from "../services/bookService";

export function useBooksApi() {
  const [books, setBooks] = useState([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshBooks = useCallback(async () => {
    setInitialLoading(true);
    setError(null);
    try {
      const userBooks = await bookService.getUserBooks();
      setBooks(userBooks);
      setInitialLoading(false);
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setError("Failed to fetch books.");
      setInitialLoading(false);
    }
  }, []);

  const changeShelf = useCallback(async (book, shelf) => {
    setActionLoading(true);
    setError(null);
    try {
      if (shelf === 'none') {
        // Remove book from user's collection
        await bookService.removeBook(book.id);
        setBooks((prevBooks) => prevBooks.filter((b) => b.id !== book.id));
      } else {
        // Check if book exists in user's collection
        const existingShelf = await bookService.bookExists(book.id);
        
        if (existingShelf) {
          // Update existing book
          await bookService.updateBookShelf(book.id, shelf);
          setBooks((prevBooks) => 
            prevBooks.map((b) => b.id === book.id ? { ...b, shelf } : b)
          );
        } else {
          // Add new book to collection
          const newBook = await bookService.addBook({ ...book, shelf });
          setBooks((prevBooks) => [...prevBooks, newBook]);
        }
      }
      setActionLoading(false);
    } catch (err) {
      console.error('Failed to update book shelf:', err);
      setError("Failed to update book shelf.");
      setActionLoading(false);
    }
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