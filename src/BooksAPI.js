
const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1';

// You can optionally add your API key here for higher quota
const API_KEY = undefined; // e.g. 'YOUR_GOOGLE_BOOKS_API_KEY'

function buildQueryParams(params) {
  return Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

export async function search(query, maxResults = 20, startIndex = 0, orderBy = 'relevance') {
  const params = {
    q: query,
    maxResults,
    startIndex,
    key: API_KEY,
    orderBy,
  };
  const url = `${GOOGLE_BOOKS_API_BASE}/volumes?${buildQueryParams(params)}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch from Google Books API');
  const data = await res.json();
  
  if (!data.items) return [];
  // Normalize to your app's book format
  return data.items.map(item => ({
    id: item.id,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors || [],
    publisher: item.volumeInfo.publisher,
    publishedDate: item.volumeInfo.publishedDate,
    description: item.volumeInfo.description,
    imageLinks: item.volumeInfo.imageLinks,
    pageCount: item.volumeInfo.pageCount,
    categories: item.volumeInfo.categories,
    averageRating: item.volumeInfo.averageRating,
    ratingsCount: item.volumeInfo.ratingsCount,
    language: item.volumeInfo.language,
    industryIdentifiers: item.volumeInfo.industryIdentifiers,
    previewLink: item.volumeInfo.previewLink,
    infoLink: item.volumeInfo.infoLink,
  }));
}

export async function get(bookId) {
  const url = `${GOOGLE_BOOKS_API_BASE}/volumes/${bookId}${API_KEY ? `?key=${API_KEY}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch book details');
  const item = await res.json();
  return {
    id: item.id,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors || [],
    publisher: item.volumeInfo.publisher,
    publishedDate: item.volumeInfo.publishedDate,
    description: item.volumeInfo.description,
    imageLinks: item.volumeInfo.imageLinks,
    pageCount: item.volumeInfo.pageCount,
    categories: item.volumeInfo.categories,
    averageRating: item.volumeInfo.averageRating,
    ratingsCount: item.volumeInfo.ratingsCount,
    language: item.volumeInfo.language,
    industryIdentifiers: item.volumeInfo.industryIdentifiers,
    previewLink: item.volumeInfo.previewLink,
    infoLink: item.volumeInfo.infoLink,
  };
}

// For compatibility
export default { search, get };
