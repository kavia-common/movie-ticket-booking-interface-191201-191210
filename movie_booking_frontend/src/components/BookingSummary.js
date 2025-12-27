import React from 'react';

/**
 * PUBLIC_INTERFACE
 * BookingSummary - Present a simple summary panel (not currently used directly)
 */
export default function BookingSummary({ items = [] }) {
  return (
    <div className="panel">
      <h3 style={{ marginTop: 0 }}>Summary</h3>
      <ul>
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </div>
  );
}
