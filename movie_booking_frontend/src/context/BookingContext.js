import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { movies, getShowtimesForMovie, generateSeatMap, pricePerSeat } from '../data/mockData';

const STORAGE_KEY = 'mbf_booking_state_v1';

const BookingContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * useBooking - Hook to access booking state and actions
 */
export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}

/**
 * PUBLIC_INTERFACE
 * BookingProvider - Provides booking data and actions with localStorage persistence
 */
export function BookingProvider({ children }) {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]); // array of seat ids like "A1"
  const [bookings, setBookings] = useState([]); // completed bookings
  const [seatMaps, setSeatMaps] = useState({}); // key `${movieId}_${showtimeId}` -> seat map object

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setSelectedMovieId(saved.selectedMovieId ?? null);
        setSelectedShowtimeId(saved.selectedShowtimeId ?? null);
        setSelectedSeats(saved.selectedSeats ?? []);
        setBookings(saved.bookings ?? []);
        setSeatMaps(saved.seatMaps ?? {});
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  // persist to localStorage
  useEffect(() => {
    const payload = {
      selectedMovieId,
      selectedShowtimeId,
      selectedSeats,
      bookings,
      seatMaps
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [selectedMovieId, selectedShowtimeId, selectedSeats, bookings, seatMaps]);

  const resetSelection = () => {
    setSelectedSeats([]);
  };

  const setSelection = (movieId, showtimeId) => {
    setSelectedMovieId(movieId);
    setSelectedShowtimeId(showtimeId);
    setSelectedSeats([]);
    const key = `${movieId}_${showtimeId}`;
    setSeatMaps(prev => {
      if (prev[key]) return prev;
      return { ...prev, [key]: generateSeatMap(movieId, showtimeId, bookings) };
    });
  };

  const toggleSeat = (seatId, max = 6) => {
    setSelectedSeats(prev => {
      const exists = prev.includes(seatId);
      if (exists) return prev.filter(s => s !== seatId);
      if (prev.length >= max) return prev; // enforce max
      return [...prev, seatId];
    });
  };

  const isSeatBooked = (movieId, showtimeId, seatId) => {
    const key = `${movieId}_${showtimeId}`;
    const map = seatMaps[key];
    if (map && map.booked?.has(seatId)) return true;
    // check bookings as source of truth
    return bookings.some(
      b => b.movieId === movieId && b.showtimeId === showtimeId && b.seats.includes(seatId)
    );
  };

  const confirmBooking = ({ name, email }) => {
    if (!selectedMovieId || !selectedShowtimeId || selectedSeats.length === 0) {
      return { ok: false, error: 'No selection to book.' };
    }
    const movie = movies.find(m => m.id === selectedMovieId);
    const showtime = getShowtimesForMovie(selectedMovieId).find(s => s.id === selectedShowtimeId);
    const total = selectedSeats.length * pricePerSeat;

    const booking = {
      id: `${Date.now()}`,
      movieId: selectedMovieId,
      showtimeId: selectedShowtimeId,
      movieTitle: movie.title,
      showtimeLabel: showtime.label,
      seats: [...selectedSeats],
      name,
      email,
      total,
      createdAt: new Date().toISOString(),
    };
    setBookings(prev => [...prev, booking]);

    // update seat map as booked
    const key = `${selectedMovieId}_${selectedShowtimeId}`;
    setSeatMaps(prev => {
      const map = prev[key] || generateSeatMap(selectedMovieId, selectedShowtimeId, bookings);
      const booked = new Set(map.booked || []);
      selectedSeats.forEach(s => booked.add(s));
      return { ...prev, [key]: { ...map, booked } };
    });

    // clear seat selection but keep movie/showtime to visualize booked state
    setSelectedSeats([]);
    return { ok: true, booking };
  };

  const value = useMemo(
    () => ({
      movies,
      getShowtimesForMovie,
      pricePerSeat,
      selectedMovieId,
      selectedShowtimeId,
      selectedSeats,
      bookings,
      seatMaps,
      setSelection,
      toggleSeat,
      resetSelection,
      isSeatBooked,
      confirmBooking,
    }),
    [
      selectedMovieId,
      selectedShowtimeId,
      selectedSeats,
      bookings,
      seatMaps
    ]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
