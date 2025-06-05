import React from 'react';
import styled from 'styled-components';
import ResultCard from './ResultCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 20px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #a0aec0;
  margin-top: 30px;
  font-size: 16px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.primary};
  margin-top: 30px;
  font-weight: ${props => props.theme.fontWeights.medium};
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.error};
  margin-top: 20px;
  padding: 12px;
  background: #fff5f5;
  border-radius: ${props => props.theme.borderRadius.medium};
  border: 1px solid #fed7d7;
`;

const ResultsGrid = ({ recommendations, loading, error }) => {
  if (loading) {
    return <LoadingMessage>Mengambil data...</LoadingMessage>;
  }
  
  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }
  
  if (recommendations.length === 0) {
    return <EmptyMessage>Belum ada hasil. Silakan isi form dan cari rekomendasi!</EmptyMessage>;
  }
  
  return (
    <Grid>
      {recommendations.map((result, index) => (
        <ResultCard key={index} result={result} />
      ))}
    </Grid>
  );
};

export default ResultsGrid;