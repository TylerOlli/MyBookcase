import React from "react";
import { Link } from "react-router-dom";
import Shelf from "./Shelf";

function Home() {
  // Mock data for featured shelves with working book cover URLs or no URLs to trigger fallbacks
  const featuredShelves = [
    {
      id: 1,
      name: "Summer Reading List",
      books: [
        {
          id: "summer1",
          title: "The Great Gatsby",
          authors: ["F. Scott Fitzgerald"],
          imageLinks: { thumbnail: "https://books.google.com/books/content?id=ueSFAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
          averageRating: 4.2,
          ratingsCount: 1250
        },
        {
          id: "summer2",
          title: "To Kill a Mockingbird",
          authors: ["Harper Lee"],
          imageLinks: { thumbnail: "https://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
          averageRating: 4.5,
          ratingsCount: 2100
        },
        {
          id: "summer3",
          title: "The Alchemist",
          authors: ["Paulo Coelho"],
          imageLinks: { thumbnail: "https://books.google.com/books/content?id=1oFyDgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
          averageRating: 4.1,
          ratingsCount: 890
        }
      ]
    },
    {
      id: 2,
      name: "Sci-Fi Classics",
      books: [
        {
          id: "scifi1",
          title: "Dune",
          authors: ["Frank Herbert"],
          imageLinks: { thumbnail: "https://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
          averageRating: 4.3,
          ratingsCount: 1560
        },
        {
          id: "scifi2",
          title: "1984",
          authors: ["George Orwell"],
          imageLinks: { thumbnail: "https://books.google.com/books/content?id=1oFyDgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
          averageRating: 4.4,
          ratingsCount: 1890
        },
        {
          id: "scifi3",
          title: "The Hitchhiker's Guide to the Galaxy",
          authors: ["Douglas Adams"],
          imageLinks: { thumbnail: "https://books.google.com/books/content?id=1oFyDgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
          averageRating: 4.2,
          ratingsCount: 1120
        },
        {
          id: "scifi4",
          title: "Neuromancer",
          authors: ["William Gibson"],
          imageLinks: { thumbnail: "https://books.google.com/books/content?id=1oFyDgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
          averageRating: 4.0,
          ratingsCount: 780
        }
      ]
    },
    {
      id: 3,
      name: "Business & Leadership",
      books: [
        {
          id: "business1",
          title: "Atomic Habits",
          authors: ["James Clear"],
          imageLinks: { thumbnail: "https://books.google.com/books/content?id=1oFyDgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
          averageRating: 4.6,
          ratingsCount: 2300
        },
        {
          id: "business2",
          title: "The 7 Habits of Highly Effective People",
          authors: ["Stephen R. Covey"],
          imageLinks: { thumbnail: "https://books.google.com/books/content?id=1oFyDgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
          averageRating: 4.3,
          ratingsCount: 1670
        },
        {
          id: "business3",
          title: "Thinking, Fast and Slow",
          authors: ["Daniel Kahneman"],
          imageLinks: { thumbnail: "https://books.google.com/books/content?id=1oFyDgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
          averageRating: 4.2,
          ratingsCount: 1450
        }
      ]
    }
  ];

  // Function to get a placeholder book cover based on title
  const getPlaceholderCover = (title) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    ];
    
    // Use title to generate consistent color
    const colorIndex = title.length % colors.length;
    return colors[colorIndex];
  };

  // Process books to force fallback covers since the URLs don't work
  const processedShelves = featuredShelves.map(shelf => ({
    ...shelf,
    books: shelf.books.map(book => ({
      ...book,
      // Force fallback covers since the mock URLs don't work
      imageLinks: { thumbnail: null },
      // Add a custom cover style for books without images
      customCover: getPlaceholderCover(book.title)
    }))
  }));

  return (
    <div className="home-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>
          Welcome to MyBookcase
        </h1>
        <p style={{ fontSize: '1.3rem', color: '#64748b', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          Your personal library and book explorer. Discover, organize, and track your reading journey.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link to="/myshelves" className="home-nav-btn" style={{ 
            padding: '1rem 2rem', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white', 
            borderRadius: 12, 
            fontWeight: 600, 
            textDecoration: 'none', 
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            📚 My Shelves
          </Link>
          <Link to="/explore" className="home-nav-btn" style={{ 
            padding: '1rem 2rem', 
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)', 
            color: 'white', 
            borderRadius: 12, 
            fontWeight: 600, 
            textDecoration: 'none', 
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            🔍 Explore Books
          </Link>
          <Link to="/newshelf" className="home-nav-btn" style={{ 
            padding: '1rem 2rem', 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            color: 'white', 
            borderRadius: 12, 
            fontWeight: 600, 
            textDecoration: 'none', 
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            ➕ New Shelf
          </Link>
        </div>
      </div>

      {/* Featured Shelves Section */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: '600', 
          color: '#1e293b', 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Featured Shelves
        </h2>
        <p style={{ 
          textAlign: 'center', 
          color: '#64748b', 
          fontSize: '1.1rem', 
          marginBottom: '3rem',
          maxWidth: '600px',
          margin: '0 auto 3rem auto'
        }}>
          Discover curated collections and get inspired to create your own custom shelves
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {processedShelves.map(shelf => (
            <div key={shelf.id} style={{ 
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <Shelf
                shelf={shelf.name}
                books={[]}
                shelfBooks={shelf.books}
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
      </div>

      {/* Call to Action */}
      <div style={{ 
        textAlign: 'center', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '3rem 2rem',
        color: 'white',
        marginTop: '4rem'
      }}>
        <h3 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '1rem' }}>
          Ready to Start Your Reading Journey?
        </h3>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
          Create your own custom shelves and start organizing your personal library today.
        </p>
        <Link to="/newshelf" style={{ 
          display: 'inline-block',
          padding: '1rem 2rem', 
          background: 'rgba(255, 255, 255, 0.2)', 
          color: 'white', 
          borderRadius: 12, 
          fontWeight: 600, 
          textDecoration: 'none', 
          fontSize: '1.1rem',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.3s ease'
        }}>
          Create Your First Shelf
        </Link>
      </div>
    </div>
  );
}

export default Home; 