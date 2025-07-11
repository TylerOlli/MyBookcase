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
      // Use book_id (Google Books API ID) for database operations, not id (Supabase UUID)
      const bookId = book.book_id || book.id;
      console.log('changeShelf called with:', { bookId, shelf, bookTitle: book.title });
      
      if (shelf === 'none') {
        // Remove book from user's collection - update UI immediately for responsiveness
        console.log('Removing book:', bookId, book.title);
        
        // Update local state immediately for instant feedback
        setBooks((prevBooks) => {
          const filtered = prevBooks.filter((b) => (b.book_id || b.id) !== bookId);
          console.log('Books after removal:', filtered.length);
          return filtered;
        });
        
        // Then handle the database operation in the background
        try {
          await bookService.removeBook(bookId);
        } catch (dbError) {
          console.error('Database removal failed, reverting UI:', dbError);
          // Revert the UI change if database operation fails
          setBooks((prevBooks) => [...prevBooks, book]);
          setError("Failed to remove book from database.");
        }
      } else {
        // Check if book exists in user's collection
        const existingShelf = await bookService.bookExists(bookId);
        let updatedBook;
        if (existingShelf) {
          // Update existing book
          updatedBook = await bookService.updateBookShelf(bookId, shelf);
        } else {
          // Add new book to collection
          updatedBook = await bookService.addBook({ ...book, shelf });
        }
        // Always update in place, never duplicate
        setBooks((prevBooks) => {
          const filtered = prevBooks.filter((b) => (b.book_id || b.id) !== bookId);
          return [...filtered, updatedBook];
        });
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