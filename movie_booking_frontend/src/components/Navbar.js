import React from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Navbar - Top navigation bar with brand and primary links
 */
export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="navbar-inner">
        <Link to="/" className="brand" aria-label="Go to home">
          <span className="brand-badge" aria-hidden>🎬</span>
          Ocean Movies
        </Link>
        <div className="nav-links" aria-label="Primary">
          <NavLink to="/" end>Home</NavLink>
        </div>
        <div style={{ marginLeft: 'auto', color: '#6b7280', fontSize: 14 }}>
          <span className="kbd" aria-hidden>⏎</span> to select · <span className="kbd" aria-hidden>← → ↑ ↓</span> to navigate
        </div>
      </div>
    </nav>
  );
}
