import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Confirmation - Displays confirmation details after booking
 */
export default function Confirmation() {
  const { state } = useLocation();
  const booking = state?.booking;

  if (!booking) {
    return (
      <div className="panel">
        <p>No booking found.</p>
        <Link to="/"><button className="btn" style={{ marginTop: 8 }}>Go Home</button></Link>
      </div>
    );
  }

  return (
    <div className="panel" role="status" aria-live="polite">
      <h2 style={{ marginTop: 0 }}>Booking Confirmed</h2>
      <p className="subtle">Your tickets have been reserved successfully.</p>
      <div className="summary" style={{ marginTop: 12 }}>
        <div className="line"><span>Reference</span><strong>{booking.id}</strong></div>
        <div className="line"><span>Movie</span><strong>{booking.movieTitle}</strong></div>
        <div className="line"><span>Showtime</span><strong>{booking.showtimeLabel}</strong></div>
        <div className="line"><span>Seats</span><strong>{booking.seats.join(', ')}</strong></div>
        <div className="line total"><span>Total Paid</span><span>${booking.total}</span></div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <Link to="/"><button className="btn">Back to Home</button></Link>
      </div>
    </div>
  );
}
