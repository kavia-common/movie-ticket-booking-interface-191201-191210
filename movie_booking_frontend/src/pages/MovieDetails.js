import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { movies, getShowtimesForMovie } from '../data/mockData';
import { useBooking } from '../context/BookingContext';

/**
 * PUBLIC_INTERFACE
 * MovieDetails - Page to show movie description and select a showtime
 */
export default function MovieDetails() {
  const { movieId } = useParams();
  const nav = useNavigate();
  const movie = useMemo(() => movies.find((m) => m.id === movieId), [movieId]);
  const showtimes = useMemo(() => getShowtimesForMovie(movieId), [movieId]);
  const [selectedSt, setSelectedSt] = useState(null);
  const { setSelection } = useBooking();

  if (!movie) {
    return (
      <div className="panel">
        <p>Movie not found.</p>
        <Link to="/"><button className="btn" style={{ marginTop: 8 }}>Back to Home</button></Link>
      </div>
    );
  }

  const proceed = () => {
    if (!selectedSt) return;
    setSelection(movie.id, selectedSt);
    nav(`/movie/${movie.id}/showtime/${selectedSt}/seats`);
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div className="panel" role="region" aria-label="Movie details">
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16 }}>
          <div style={{ background: movie.posterColor, borderRadius: 12, height: 120 }} aria-hidden />
          <div style={{ display: 'grid', gap: 8 }}>
            <h2 className="title" style={{ margin: 0 }}>{movie.title}</h2>
            <div className="subtle">{movie.genre} · {movie.runtime}m · {movie.rating}</div>
            <p style={{ margin: 0 }}>{movie.description}</p>
          </div>
        </div>
      </div>

      <div className="panel" role="region" aria-label="Showtimes">
        <h3 style={{ marginTop: 0 }}>Select a Showtime</h3>
        <div className="showtimes" role="listbox" aria-label="Showtime options">
          {showtimes.map(st => (
            <button
              key={st.id}
              role="option"
              aria-selected={selectedSt === st.id}
              className={`showtime ${selectedSt === st.id ? 'selected' : ''}`}
              onClick={() => setSelectedSt(st.id)}
            >
              {st.label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button className="btn" onClick={proceed} disabled={!selectedSt} aria-disabled={!selectedSt}>Choose Seats</button>
          <Link to="/"><button className="btn btn-ghost">Cancel</button></Link>
        </div>
      </div>
    </div>
  );
}
