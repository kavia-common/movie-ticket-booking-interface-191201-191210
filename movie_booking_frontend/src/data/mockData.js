const makeId = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export const movies = [
  {
    id: 'voyage-blue',
    title: 'Voyage of the Blue Horizon',
    rating: 'PG-13',
    runtime: 128,
    genre: 'Adventure',
    posterColor: '#dbeafe',
    description:
      'An inspiring oceanic expedition where a young navigator discovers courage amidst vast blue horizons.',
  },
  {
    id: 'amber-heist',
    title: 'Amber City Heist',
    rating: 'PG-13',
    runtime: 112,
    genre: 'Action',
    posterColor: '#ffedd5',
    description:
      'A sleek, high-stakes heist set against neon skylines and the relentless pulse of the city.',
  },
  {
    id: 'silent-current',
    title: 'The Silent Current',
    rating: 'PG',
    runtime: 101,
    genre: 'Drama',
    posterColor: '#e5e7eb',
    description:
      'A heartfelt drama following intertwined lives bound by tides, time, and unspoken truths.',
  },
  {
    id: 'deep-signal',
    title: 'Deep Signal',
    rating: 'R',
    runtime: 134,
    genre: 'Sci-Fi',
    posterColor: '#fce7f3',
    description:
      'When a deep-sea research station receives a mysterious signal, the crew must confront what lies beneath.',
  },
];

const showtimeTempl = ['10:30', '13:15', '16:40', '19:00', '21:30'];

export const getShowtimesForMovie = (movieId) =>
  showtimeTempl.map((t, idx) => ({
    id: `${movieId}-st-${idx + 1}`,
    label: t,
  }));

export const pricePerSeat = 12;

export const generateSeatMap = (movieId, showtimeId, bookings = []) => {
  // 8 rows x 12 columns
  const rows = 'ABCDEFGH'.split('');
  const cols = Array.from({ length: 12 }).map((_, i) => i + 1);

  const booked = new Set();
  // mark booked based on existing bookings
  bookings
    .filter((b) => b.movieId === movieId && b.showtimeId === showtimeId)
    .forEach((b) => b.seats.forEach((s) => booked.add(s)));

  const layout = rows.map((r) =>
    cols.map((c) => {
      const id = `${r}${c}`;
      return { id, row: r, col: c, booked: booked.has(id) };
    })
  );

  return { rows, cols, layout, booked };
};
