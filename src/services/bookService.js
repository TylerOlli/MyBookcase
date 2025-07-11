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
    return data
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
    return data
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
    return data
  },

  // Remove book from user's collection
  async removeBook(bookId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('user_books')
      .delete()
      .eq('user_id', user.id)
      .eq('book_id', bookId)

    if (error) throw error
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
    return data
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