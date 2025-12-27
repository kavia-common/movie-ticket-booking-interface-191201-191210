import React from 'react';

/**
 * PUBLIC_INTERFACE
 * SeatMap - Reusable seat map component (not directly used; kept for modularity)
 */
export default function SeatMap({ map, selectedSeats, onToggle, max = 6 }) {
  return (
    <div className="seatmap" role="grid" aria-label="Seats">
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
                onClick={() => onToggle(seat.id, max)}
              >
                {seat.col}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
