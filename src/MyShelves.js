import React, { useEffect, useState } from "react";
import Shelf from "./Shelf";
import { shelfService } from "./services/shelfService";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

function MyShelves({ books, changeShelf, handleShelfDragOver, handleShelfDragLeave, handleShelfDrop, dragOverShelf, handleBookDragStart, handleBookDragEnd, draggedBook, handleShowDetails }) {
  const [customShelves, setCustomShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingShelf, setDeletingShelf] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, shelfId: null, shelfName: '' });

  useEffect(() => {
    fetchShelves();
  }, []);

  async function fetchShelves() {
    setLoading(true);
    setError(null);
    try {
      const shelves = await shelfService.getUserShelves();
      setCustomShelves(shelves);
    } catch (err) {
      setError(err.message || 'Failed to load custom shelves');
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (shelfId, shelfName) => {
    setDeleteModal({ isOpen: true, shelfId, shelfName });
  };

  const handleDeleteConfirm = async () => {
    const { shelfId, shelfName } = deleteModal;
    setDeletingShelf(shelfId);
    setDeleteModal({ isOpen: false, shelfId: null, shelfName: '' });
    
    try {
      await shelfService.deleteShelf(shelfId);
      // Refresh the shelves list
      await fetchShelves();
    } catch (err) {
      setError(err.message || 'Failed to delete shelf');
    } finally {
      setDeletingShelf(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, shelfId: null, shelfName: '' });
  };

  return (
    <div className="list-books-content">
      <Shelf
        shelf={"currentlyReading"}
        books={books}
        onChangeShelf={changeShelf}
        onDragOver={handleShelfDragOver}
        onDragLeave={handleShelfDragLeave}
        onDrop={handleShelfDrop}
        dragOverShelf={dragOverShelf}
        onBookDragStart={handleBookDragStart}
        onBookDragEnd={handleBookDragEnd}
        draggedBook={draggedBook}
        onShowDetails={handleShowDetails}
      />
      <Shelf
        shelf={"wantToRead"}
        books={books}
        onChangeShelf={changeShelf}
        onDragOver={handleShelfDragOver}
        onDragLeave={handleShelfDragLeave}
        onDrop={handleShelfDrop}
        dragOverShelf={dragOverShelf}
        onBookDragStart={handleBookDragStart}
        onBookDragEnd={handleBookDragEnd}
        draggedBook={draggedBook}
        onShowDetails={handleShowDetails}
      />
      <Shelf
        shelf={"read"}
        books={books}
        onChangeShelf={changeShelf}
        onDragOver={handleShelfDragOver}
        onDragLeave={handleShelfDragLeave}
        onDrop={handleShelfDrop}
        dragOverShelf={dragOverShelf}
        onBookDragStart={handleBookDragStart}
        onBookDragEnd={handleBookDragEnd}
        draggedBook={draggedBook}
        onShowDetails={handleShowDetails}
      />
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>My Custom Shelves</h2>
        {loading && <div style={{ color: '#667eea' }}>Loading custom shelves...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {customShelves.length === 0 && !loading && !error && (
          <div style={{ color: '#64748b', fontStyle: 'italic' }}>No custom shelves yet. Create one from the New Shelf page!</div>
        )}
        {customShelves.map(shelf => (
          <div key={shelf.id} style={{ marginBottom: '2.5rem', position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              top: '0.5rem', 
              right: '1rem', 
              zIndex: 10,
              display: 'flex',
              gap: '0.5rem'
            }}>
              <button
                onClick={() => handleDeleteClick(shelf.id, shelf.name)}
                disabled={deletingShelf === shelf.id}
                style={{
                  background: deletingShelf === shelf.id ? '#94a3b8' : '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: deletingShelf === shelf.id ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  width: '36px',
                  height: '36px'
                }}
                title={`Delete "${shelf.name}" shelf`}
              >
                {deletingShelf === shelf.id ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                )}
              </button>
            </div>
            <Shelf
              shelf={shelf.name}
              books={[]} // Empty array since we're using shelfBooks prop
              shelfBooks={shelf.user_shelf_books.map(b => b.book_data)}
              onChangeShelf={() => {}}
              onShowDetails={() => {}}
              onBookDragStart={() => {}}
              onBookDragEnd={() => {}}
              onDragOver={() => {}}
              onDragLeave={() => {}}
              onDrop={() => {}}
              dragOverShelf={null}
              draggedBook={null}
            />
          </div>
        ))}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        shelfName={deleteModal.shelfName}
        isDeleting={deletingShelf === deleteModal.shelfId}
      />
    </div>
  );
}

export default MyShelves; 