import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar" style={{
      width: '100%',
      background: 'white',
      borderBottom: '2px solid #e2e8f0',
      padding: '1rem 0',
      marginBottom: '2rem',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', padding: '0 2rem' }}>
        <NavLink to="/" className="navbar-logo" style={{ fontWeight: 700, fontSize: '1.3rem', color: '#667eea', textDecoration: 'none', letterSpacing: '1px' }}>
          MyBookcase
        </NavLink>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <NavLink to="/myshelves" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'} style={({ isActive }) => ({ color: isActive ? '#764ba2' : '#64748b', fontWeight: 600, textDecoration: 'none', fontSize: '1.05rem', padding: '0.5rem 1rem', borderRadius: 8, background: isActive ? 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)' : 'none', transition: 'all 0.2s' })}>
            My Shelves
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'} style={({ isActive }) => ({ color: isActive ? '#764ba2' : '#64748b', fontWeight: 600, textDecoration: 'none', fontSize: '1.05rem', padding: '0.5rem 1rem', borderRadius: 8, background: isActive ? 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)' : 'none', transition: 'all 0.2s' })}>
            Explore
          </NavLink>
          <NavLink to="/newshelf" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'} style={({ isActive }) => ({ color: isActive ? '#764ba2' : '#64748b', fontWeight: 600, textDecoration: 'none', fontSize: '1.05rem', padding: '0.5rem 1rem', borderRadius: 8, background: isActive ? 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)' : 'none', transition: 'all 0.2s' })}>
            New Shelf
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default NavBar; 