// Utility functions for book operations

export function getBooksForShelf(books, shelf) {
  return books.filter((book) => book.shelf === shelf);
} 