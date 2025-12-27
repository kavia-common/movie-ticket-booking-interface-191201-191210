import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { pricePerSeat, movies, getShowtimesForMovie } from '../data/mockData';

/**
 * PUBLIC_INTERFACE
 * Checkout - Captures simple user details and confirms booking
 */
export default function Checkout() {
  const nav = useNavigate();
  const { selectedMovieId, selectedShowtimeId, selectedSeats, confirmBooking } = useBooking();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const movie = movies.find(m => m.id === selectedMovieId);
  const showtime = selectedMovieId ? getShowtimesForMovie(selectedMovieId).find(s => s.id === selectedShowtimeId) : null;

  if (!selectedMovieId || !selectedShowtimeId || selectedSeats.length === 0) {
    return (
      <div className="panel">
        <p>No seats selected. Please choose a movie and seats first.</p>
        <Link to="/"><button className="btn" style={{ marginTop: 8 }}>Back to Home</button></Link>
      </div>
    );
  }

  const total = selectedSeats.length * pricePerSeat;

  const onSubmit = (e) => {
    e.preventDefault();
    const res = confirmBooking({ name, email });
    if (res.ok) {
      nav('/confirmation', { state: { booking: res.booking } });
    }
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Booking Summary</h3>
        <div className="summary" aria-live="polite" aria-atomic="true">
          <div className="line"><span>Movie</span><strong>{movie?.title}</strong></div>
          <div className="line"><span>Showtime</span><strong>{showtime?.label}</strong></div>
          <div className="line"><span>Seats</span><strong aria-label="Selected seats">{selectedSeats.join(', ')}</strong></div>
          <div className="line"><span>Price per seat</span><span>${pricePerSeat}</span></div>
          <div className="line total" aria-label="Total price"><span>Total</span><span>${total}</span></div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="panel form" aria-label="Checkout form">
        <h3 style={{ marginTop: 0 }}>Your Details</h3>
        <div className="form-row">
          <label>
            <div className="subtle">Name</div>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-label="Your name" required />
          </label>
          <label>
            <div className="subtle">Email</div>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-label="Your email" required />
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="btn" type="submit">Confirm Booking</button>
          <Link to={`/movie/${selectedMovieId}/showtime/${selectedShowtimeId}/seats`}>
            <button type="button" className="btn btn-ghost">Back to Seats</button>
          </Link>
        </div>
      </form>
    </div>
  );
}
