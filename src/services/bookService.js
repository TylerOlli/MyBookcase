import { supabase } from '../supabase'

export const bookService = {
  // Get all books for the current user
  async getUserBooks() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_books')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    console.log('getUserBooks - raw data from database:', data.map(book => ({ id: book.id, book_id: book.book_id, title: book.title })));
    
    // Normalize the data structure to match the expected format
    return data.map(book => ({
      ...book,
      imageLinks: book.image_url ? { thumbnail: book.image_url } : null
    }))
  },

  // Add a book to user's collection
  async addBook(bookData) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_books')
      .insert({
        user_id: user.id,
        book_id: bookData.id,
        title: bookData.title,
        authors: bookData.authors,
        shelf: bookData.shelf || 'wantToRead',
        image_url: bookData.imageLinks?.thumbnail || null,
        publisher: bookData.publisher,
        published_date: bookData.publishedDate,
        page_count: bookData.pageCount,
        isbn: bookData.industryIdentifiers?.[0]?.identifier,
        categories: bookData.categories,
        description: bookData.description,
        language: bookData.language,
        average_rating: bookData.averageRating,
        ratings_count: bookData.ratingsCount
      })
      .select()
      .single()

    if (error) throw error
    
    // Normalize the returned data
    return {
      ...data,
      imageLinks: data.image_url ? { thumbnail: data.image_url } : null
    }
  },

  // Update book shelf
  async updateBookShelf(bookId, shelf) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_books')
      .update({ shelf })
      .eq('user_id', user.id)
      .eq('book_id', bookId)
      .select()
      .single()

    if (error) throw error
    
    // Normalize the returned data
    return {
      ...data,
      imageLinks: data.image_url ? { thumbnail: data.image_url } : null
    }
  },

  // Remove book from user's collection
  async removeBook(bookId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    console.log('removeBook called with bookId:', bookId, 'for user:', user.id);

    // First, let's see what books exist with this book_id
    const { data: existingBooks, error: selectError } = await supabase
      .from('user_books')
      .select('id, book_id, title')
      .eq('user_id', user.id)
      .eq('book_id', bookId)

    console.log('Books found with book_id:', bookId, ':', existingBooks);

    const { error } = await supabase
      .from('user_books')
      .delete()
      .eq('user_id', user.id)
      .eq('book_id', bookId)

    if (error) {
      console.error('Error removing book:', error);
      throw error;
    }
    
    console.log('Book removed successfully');
    return true
  },

  // Get books by shelf
  async getBooksByShelf(shelf) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_books')
      .select('*')
      .eq('user_id', user.id)
      .eq('shelf', shelf)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    // Normalize the data structure to match the expected format
    return data.map(book => ({
      ...book,
      imageLinks: book.image_url ? { thumbnail: book.image_url } : null
    }))
  },

  // Check if book exists in user's collection
  async bookExists(bookId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_books')
      .select('shelf')
      .eq('user_id', user.id)
      .eq('book_id', bookId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data ? data.shelf : null
  },

  // Get reading statistics
  async getReadingStats() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_books')
      .select('shelf')
      .eq('user_id', user.id)

    if (error) throw error

    const stats = {
      currentlyReading: 0,
      wantToRead: 0,
      read: 0,
      total: data.length
    }

    data.forEach(book => {
      if (stats.hasOwnProperty(book.shelf)) {
        stats[book.shelf]++
      }
    })

    return stats
  }
} 