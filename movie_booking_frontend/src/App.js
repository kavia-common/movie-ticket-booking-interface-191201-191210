import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import { BookingProvider } from './context/BookingContext';

/**
 * PUBLIC_INTERFACE
 * App - Root application composing routes and providing global booking context.
 * Routes:
 * - / -> Home (movie grid)
 * - /movie/:movieId -> MovieDetails
 * - /movie/:movieId/showtime/:showtimeId/seats -> SeatSelection
 * - /checkout -> Checkout/BookingSummary
 * - /confirmation -> Confirmation screen
 */
function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:movieId" element={<MovieDetails />} />
              <Route
                path="/movie/:movieId/showtime/:showtimeId/seats"
                element={<SeatSelection />}
              />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </BookingProvider>
  );
}

export default App;
