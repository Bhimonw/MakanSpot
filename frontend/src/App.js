import React, { useState } from 'react';

function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

const googleMapsIcon = (
  <svg style={{ verticalAlign: 'middle', marginRight: 4 }} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335" />
  </svg>
);

function App() {
  const [form, setForm] = useState({
    price_range: '',
    min_rating: '',
    max_distance: ''
  });
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setRecommendations([]);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price_range: form.price_range,
          min_rating: form.min_rating,
          max_distance: form.max_distance
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Terjadi error');
      } else {
        setRecommendations(data);
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'Segoe UI, sans-serif', padding: 20 }}>
      <h1 style={{ textAlign: 'center', color: '#2d3748', marginBottom: 30, fontWeight: 800, letterSpacing: 1 }}>🍽️ Rekomendasi Tempat Makan</h1>
      <form onSubmit={handleSubmit} style={{
        background: '#f0f4f8',
        padding: 24,
        borderRadius: 14,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        marginBottom: 36,
        maxWidth: 500,
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <label style={{ fontWeight: 500 }}>Harga Maksimal (Rp):
          <input type="number" name="price_range" value={form.price_range} onChange={handleChange} required style={{ marginLeft: 8, padding: 6, borderRadius: 6, border: '1px solid #cbd5e1', width: 180 }} />
        </label>
        <label style={{ fontWeight: 500 }}>Rating Minimal:
          <input type="number" step="0.1" name="min_rating" value={form.min_rating} onChange={handleChange} required style={{ marginLeft: 8, padding: 6, borderRadius: 6, border: '1px solid #cbd5e1', width: 180 }} />
        </label>
        <label style={{ fontWeight: 500 }}>Jarak Maksimal (km):
          <input type="number" step="0.1" name="max_distance" value={form.max_distance} onChange={handleChange} required style={{ marginLeft: 8, padding: 6, borderRadius: 6, border: '1px solid #cbd5e1', width: 180 }} />
        </label>
        <button type="submit" style={{ marginTop: 10, padding: '12px 0', background: '#3182ce', color: 'white', border: 'none', borderRadius: 7, fontWeight: 600, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}>
          {loading ? 'Mencari...' : 'Cari Rekomendasi'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>{error}</div>}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 24,
        marginTop: 10
      }}>
        {recommendations.map((r, idx) => (
          <div key={idx} style={{
            background: '#fff',
            borderRadius: 14,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 170,
            transition: 'transform 0.15s',
            border: '1.5px solid #e2e8f0',
            position: 'relative',
            cursor: 'pointer',
            outline: 'none',
          }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'}
            onMouseOut={e => e.currentTarget.style.transform = 'none'}
          >
            <div style={{ fontSize: 22, fontWeight: 700, color: '#2b6cb0', marginBottom: 8 }}>{r.nama}</div>
            <div style={{ color: '#4a5568', marginBottom: 10 }}>
              <b>Lokasi:</b> {isUrl(r.alamat) ? (
                <a href={r.alamat} target="_blank" rel="noopener noreferrer" style={{ color: '#3182ce', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center' }}>
                  {googleMapsIcon}Lihat di Maps
                </a>
              ) : (r.alamat || '-')}
            </div>
            <div style={{ marginBottom: 4 }}>Harga: <b>Rp{r.harga}</b></div>
            <div style={{ marginBottom: 4 }}>Rating: <b>{r.rating}</b></div>
            <div style={{ marginBottom: 4 }}>Jarak: <b>{r.jarak} km</b></div>
            {r.kategori && <div style={{ marginTop: 4 }}>Kategori: <b>{r.kategori}</b></div>}
          </div>
        ))}
      </div>
      {loading && <div style={{ textAlign: 'center', color: '#3182ce', marginTop: 30, fontWeight: 500 }}>Mengambil data...</div>}
      {recommendations.length === 0 && !error && !loading && <div style={{ textAlign: 'center', color: '#a0aec0', marginTop: 30 }}>Belum ada hasil. Silakan isi form dan cari rekomendasi!</div>}
    </div>
  );
}

export default App;
