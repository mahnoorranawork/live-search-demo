import React, { useEffect, useState } from 'react';

// 1) Static data
const STATIC_ITEMS = [
  'Apple', 'AirPods', 'Adapter', 'Android',
  'Banana', 'Book', 'Camera', 'Cable', 'Case',
];

// 2) Mock search "API"
function mockSearch(q) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = STATIC_ITEMS.filter(item =>
        item.toLowerCase().includes(q.toLowerCase())
      );
      resolve(results);
    }, 200);
  });
}

// 3) Debounce Hook
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// 4) Main component
export default function LiveSearchSimple() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState(STATIC_ITEMS);
  const [loading, setLoading] = useState(false);

  const dq = useDebounce(q, 300);

  // 5) Search effect
  useEffect(() => {
    if (!dq) {
      setItems(STATIC_ITEMS);
      setLoading(false);
      return;
    }

    setLoading(true);
    mockSearch(dq).then(results => {
      setItems(results);
      setLoading(false);
    });
  }, [dq]);

  // 6) Render
  return (
    <div style={{ maxWidth: 360 }}>
      <p>Try: Apple, Android, Cable…</p>

      <input
        aria-label="Search items"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      />

      {loading && <div>Loading…</div>}

      <ul>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
