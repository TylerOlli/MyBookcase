import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container" style={{ maxWidth: 600, margin: '4rem auto', textAlign: 'center' }}>
      <h1>Welcome to MyBookcase</h1>
      <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '2rem' }}>
        Your personal library and book explorer.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        <Link to="/myshelves" className="home-nav-btn" style={{ padding: '1rem 2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: 12, fontWeight: 600, textDecoration: 'none', fontSize: '1.1rem' }}>
          My Shelves
        </Link>
        <Link to="/explore" className="home-nav-btn" style={{ padding: '1rem 2rem', background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)', color: 'white', borderRadius: 12, fontWeight: 600, textDecoration: 'none', fontSize: '1.1rem' }}>
          Explore Books
        </Link>
      </div>
    </div>
  );
}

export default Home; 