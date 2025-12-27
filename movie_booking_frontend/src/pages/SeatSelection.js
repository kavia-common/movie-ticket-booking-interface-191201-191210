import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { generateSeatMap, pricePerSeat } from '../data/mockData';

/**
 * PUBLIC_INTERFACE
 * SeatSelection - Allows selecting seats for a chosen showtime with keyboard support
 */
export default function SeatSelection() {
  const { movieId, showtimeId } = useParams();
  const nav = useNavigate();
  const {
    setSelection,
    selectedMovieId,
    selectedShowtimeId,
    selectedSeats,
    toggleSeat,
    seatMaps,
    bookings,
    confirmBooking,
  } = useBooking();

  useEffect(() => {
    if (movieId && showtimeId) setSelection(movieId, showtimeId);
  }, [movieId, showtimeId, setSelection]);

  const key = `${movieId}_${showtimeId}`;
  const map = seatMaps[key] || generateSeatMap(movieId, showtimeId, bookings);
  const maxSeats = 6;

  const gridRef = useRef(null);
  const flatSeats = useMemo(
    () => map.layout.flat().map(s => s),
    [map]
  );

  // Keyboard navigation: arrow keys move focus in grid
  useEffect(() => {
    const root = gridRef.current;
    if (!root) return;
    const seats = root.querySelectorAll('button.seat.available, button.seat.selected');
    if (seats.length > 0 && !root.contains(document.activeElement)) {
      const first = seats[0];
      if (first && typeof first.focus === 'function') {
        first.focus();
      }
    }
  }, [map, selectedSeats]);

  const onConfirm = () => {
    nav('/checkout');
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div className="panel" role="region" aria-label="Seat selection">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0 }}>Pick Your Seats</h3>
          <div className="seat-legend" aria-hidden>
            <span className="badge available">Available</span>
            <span className="badge selected">Selected</span>
            <span className="badge booked">Booked</span>
          </div>
        </div>
        <div style={{ height: 8 }} />
        <div className="seatmap" ref={gridRef} role="grid" aria-label="Seats">
          {map.layout.map((row, ri) => (
            <div key={ri} className="seat-row" role="row" aria-label={`Row ${map.rows[ri]}`}>
              {row.map((seat) => {
                const isSelected = selectedSeats.includes(seat.id);
                const isBooked = seat.booked;
                const state = isBooked ? 'booked' : isSelected ? 'selected' : 'available';
                return (
                  <button
                    key={seat.id}
                    type="button"
                    role="gridcell"
                    aria-label={`Seat ${seat.id} ${isBooked ? 'booked' : isSelected ? 'selected' : 'available'}`}
                    aria-disabled={isBooked}
                    className={`seat ${state}`}
                    disabled={isBooked}
                    onClick={() => toggleSeat(seat.id, maxSeats)}
                    onKeyDown={(e) => {
                      // Basic arrow navigation to neighbors
                      const cols = map.cols.length;
                      const idx = flatSeats.findIndex(s => s.id === seat.id);
                      let nextIdx = -1;
                      if (e.key === 'ArrowRight') nextIdx = idx + 1;
                      if (e.key === 'ArrowLeft') nextIdx = idx - 1;
                      if (e.key === 'ArrowDown') nextIdx = idx + cols;
                      if (e.key === 'ArrowUp') nextIdx = idx - cols;
                      if (nextIdx >= 0 && nextIdx < flatSeats.length) {
                        const targetId = flatSeats[nextIdx].id;
                        const container = gridRef.current;
                        const targetEl = container ? container.querySelector(`button[aria-label^="Seat ${targetId}"]`) : null;
                        if (targetEl && typeof targetEl.focus === 'function') {
                          e.preventDefault();
                          targetEl.focus();
                        }
                      }
                    }}
                  >
                    {seat.col}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ height: 12 }} />
        <div className="panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div aria-live="polite" aria-atomic="true">
            <div className="summary">
              <div className="line">
                <span>Selected seats</span>
                <strong aria-label="Selected seats list">{selectedSeats.join(', ') || 'None'}</strong>
              </div>
              <div className="line">
                <span>Price per seat</span>
                <span>${pricePerSeat}</span>
              </div>
              <div className="line total" aria-label="Total price">
                <span>Total</span>
                <span>${selectedSeats.length * pricePerSeat}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={onConfirm} disabled={selectedSeats.length === 0}>Proceed to Checkout</button>
            <Link to={`/movie/${movieId}`}><button className="btn btn-ghost">Back</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
