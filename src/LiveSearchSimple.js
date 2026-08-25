import React, { useEffect, useState } from 'react';

// Step 1: Some sample items to search from
const STATIC_ITEMS = [
  'Apple', 'AirPods', 'Adapter', 'Android',
  'Banana', 'Book', 'Camera', 'Cable', 'Case',
];

// Step 2: Fake search function (like an API)
// It waits 200ms, then returns items that match the text
function mockSearch(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = STATIC_ITEMS.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    }, 200);
  });
}

// Step 3: Debounce hook
// Waits a little before using the latest input value
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value changes quickly
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Step 4: Main component
export default function LiveSearchSimple() {
  // State: input text, list of items, loading flag
  const [q, setQ] = useState('');
  const [items, setItems] = useState(STATIC_ITEMS);
  const [loading, setLoading] = useState(false);

  // Use debounce so search doesn’t run on every keystroke
  const dq = useDebounce(q, 300);

  // Step 5: Run search when debounced value changes
  useEffect(() => {
    if (!dq) {
      // If input is empty, show all static items
      setItems(STATIC_ITEMS);
      setLoading(false);
      return;
    }

    // Show loading, then run fake search
    setLoading(true);
    mockSearch(dq).then(results => {
      setItems(results);
      setLoading(false);
    });
  }, [dq]);

  // Step 6: Render UI
  return (
    <div style={{ maxWidth: 360 }}>
      <p>Try typing: Apple, Android, Cable…</p>

      {/* Input box controlled by state */}
      <input
        aria-label="Search items"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      />

      {/* Show loading text if searching */}
      {loading && <div>Loading…</div>}

      {/* Show list of items */}
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
