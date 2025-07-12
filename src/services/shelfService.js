import { supabase } from '../supabase';

export const shelfService = {
  // Create a new shelf and add books
  async createShelf(name, books) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Insert shelf
    const { data: shelf, error: shelfError } = await supabase
      .from('user_shelves')
      .insert({ user_id: user.id, name })
      .select()
      .single();

    if (shelfError) throw shelfError;

    // Insert books
    const bookRows = books.map(book => ({
      shelf_id: shelf.id,
      book_id: book.id,
      book_data: book,
    }));

    const { error: booksError } = await supabase
      .from('user_shelf_books')
      .insert(bookRows);

    if (booksError) throw booksError;

    return shelf;
  },

  // Delete a shelf and all its books
  async deleteShelf(shelfId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First delete all books in the shelf
    const { error: booksError } = await supabase
      .from('user_shelf_books')
      .delete()
      .eq('shelf_id', shelfId);

    if (booksError) throw booksError;

    // Then delete the shelf itself
    const { error: shelfError } = await supabase
      .from('user_shelves')
      .delete()
      .eq('id', shelfId)
      .eq('user_id', user.id); // Ensure user can only delete their own shelves

    if (shelfError) throw shelfError;

    return true;
  },

  // Fetch all shelves for the current user (with books)
  async getUserShelves() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get shelves
    const { data: shelves, error } = await supabase
      .from('user_shelves')
      .select('*, user_shelf_books(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Format: each shelf has a user_shelf_books array
    return shelves;
  }
}; 