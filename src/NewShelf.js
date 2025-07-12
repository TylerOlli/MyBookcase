import React, { useState, useCallback } from "react";
import Book from "./Book";
import { search as googleBooksSearch } from "./BooksAPI";
import Shelf from "./Shelf";
import { shelfService } from "./services/shelfService";

function NewShelf() {
  const [shelfName, setShelfName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [shelfBooks, setShelfBooks] = useState([]); // books added to this shelf
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Dummy: allow adding books to shelf
  const handleAddToShelf = (book) => {
    if (!shelfBooks.find(b => b.id === book.id)) {
      setShelfBooks(prev => [...prev, book]);
    }
  };

  const handleRemoveFromShelf = (bookId) => {
    setShelfBooks(prev => prev.filter(b => b.id !== bookId));
  };

  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await googleBooksSearch(query.trim());
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSaveShelf = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await shelfService.createShelf(shelfName, shelfBooks);
      setSaveSuccess(true);
      setShelfName("");
      setShelfBooks([]);
      setSearchQuery("");
      setSearchResults([]);
    } catch (err) {
      setSaveError(err.message || 'Failed to save shelf');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Create a New Shelf</h2>
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input
          type="text"
          value={shelfName}
          onChange={e => setShelfName(e.target.value)}
          placeholder="Shelf name (e.g. Summer Reads, Sci-Fi Gems)"
          style={{ fontSize: '1.1rem', padding: '0.75rem 1.2rem', borderRadius: 8, border: '1px solid #cbd5e1', width: 320 }}
        />
        <span style={{ color: '#64748b', fontSize: '1rem' }}>
          {shelfName ? `Shelf name: ${shelfName}` : 'Enter a name for your shelf'}
        </span>
      </div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h3>Search and Add Books</h3>
        <input
          type="text"
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search for books to add..."
          style={{ fontSize: '1rem', padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', width: 320, marginBottom: '1rem' }}
        />
        {isSearching && <div style={{ color: '#667eea', margin: '1rem 0' }}>Searching...</div>}
        <div className="browse-results" style={{ marginTop: '1rem' }}>
          {searchResults.map(book => (
            <div key={book.id} className="browse-book-item">
              <Book book={book} isBrowseView={true} />
              <button
                style={{ marginTop: 8, background: '#667eea', color: 'white', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => handleAddToShelf(book)}
                disabled={!!shelfBooks.find(b => b.id === book.id)}
              >
                {shelfBooks.find(b => b.id === book.id) ? 'Added' : 'Add to Shelf'}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '3rem' }}>
        <h3>Preview: {shelfName || 'Your Shelf'}</h3>
        {shelfBooks.length === 0 ? (
          <div style={{ color: '#64748b', fontStyle: 'italic', margin: '2rem 0' }}>No books added yet. Search and add books above!</div>
        ) : (
          <Shelf
            shelf={shelfName || 'Custom Shelf'}
            books={shelfBooks}
            onChangeShelf={(book, shelf) => {}}
            onShowDetails={() => {}}
            onBookDragStart={() => {}}
            onBookDragEnd={() => {}}
            onDragOver={() => {}}
            onDragLeave={() => {}}
            onDrop={() => {}}
            dragOverShelf={null}
            draggedBook={null}
          />
        )}
        {shelfBooks.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h4>Remove a book from this shelf:</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {shelfBooks.map(book => (
                <li key={book.id} style={{ marginBottom: 8 }}>
                  <span style={{ marginRight: 12 }}>{book.title}</span>
                  <button
                    style={{ background: '#e53e3e', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => handleRemoveFromShelf(book.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={handleSaveShelf}
          disabled={saving || !shelfName || shelfBooks.length === 0}
          style={{ marginTop: 24, padding: '0.8rem 2rem', background: '#764ba2', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '1.1rem', cursor: saving ? 'not-allowed' : 'pointer' }}
        >
          {saving ? 'Saving...' : 'Save Shelf'}
        </button>
        {saveError && <div style={{ color: 'red', marginTop: 12 }}>{saveError}</div>}
        {saveSuccess && <div style={{ color: 'green', marginTop: 12 }}>Shelf saved!</div>}
      </div>
    </div>
  );
}

export default NewShelf; 