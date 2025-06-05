import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import Container from './components/Layout/Container';
import Header from './components/Layout/Header';
import FilterForm from './components/Form/FilterForm';
import ResultsGrid from './components/Results/ResultsGrid';
import { theme } from './styles/theme';

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setError('');
    setRecommendations([]);
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5001/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price_range: values.price_range,
          min_rating: values.min_rating,
          max_distance: values.max_distance,
          kategori: values.kategori || undefined
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
      console.error(err);
    }
    
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header />
        <FilterForm onSubmit={handleSubmit} loading={loading} />
        <ResultsGrid 
          recommendations={recommendations} 
          loading={loading} 
          error={error} 
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
