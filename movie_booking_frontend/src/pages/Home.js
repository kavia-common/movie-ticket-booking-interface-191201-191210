import React from 'react';
import { movies } from '../data/mockData';
import MovieCard from '../components/MovieCard';

/**
 * PUBLIC_INTERFACE
 * Home - Landing page showing a grid of movies
 */
export default function Home() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <header style={{ display: 'grid', gap: 6 }}>
        <h1 className="title">Now Showing</h1>
        <p className="subtle">Choose a movie to see details and available showtimes.</p>
      </header>
      <div className="grid">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </div>
  );
}
