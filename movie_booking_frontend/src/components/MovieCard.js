import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * MovieCard - Displays poster, title, genre, and link
 */
export default function MovieCard({ movie }) {
  return (
    <article className="card" aria-label={`${movie.title} movie card`}>
      <div
        className="card-media"
        role="img"
        aria-label={`${movie.title} poster`}
        style={{ background: movie.posterColor }}
      />
      <div className="card-body">
        <div className="title">{movie.title}</div>
        <div className="subtle">{movie.genre} · {movie.runtime}m · {movie.rating}</div>
        <Link to={`/movie/${movie.id}`} aria-label={`View details for ${movie.title}`}>
          <button className="btn" style={{ marginTop: 8 }}>View Details</button>
        </Link>
      </div>
    </article>
  );
}
