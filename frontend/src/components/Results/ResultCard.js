import React from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaStar, FaMoneyBillWave, FaWalking } from 'react-icons/fa';
import { isUrl, formatPrice } from '../../utils/helpers';

const Card = styled.div`
  background: #fff;
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.small};
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  min-height: 200px;
  transition: transform 0.15s, box-shadow 0.15s;
  border: 1.5px solid #e2e8f0;
  position: relative;
  cursor: pointer;
  outline: none;
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const Title = styled.h3`
  font-size: 22px;
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.secondary};
  margin-bottom: 8px;
  margin-top: 0;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.lightText};
  
  svg {
    margin-right: 8px;
    color: ${props => props.theme.colors.primary};
  }
  
  b {
    margin-left: 4px;
  }
`;

const MapLink = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: underline;
  display: inline-flex;
  align-items: center;
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
  
  svg {
    margin-right: 4px;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: ${props => props.theme.fontWeights.medium};
`;

const ResultCard = ({ result }) => {
  const { nama, alamat, harga, rating, jarak, kategori, cluster, cluster_label } = result;
  
  // Gunakan cluster_label dari backend jika tersedia, atau fallback ke label default
  const clusterNames = {
    0: 'Value-Oriented',
    1: 'Balanced-Choice',
    2: 'Premium-Experience'
  };
  
  // Format nilai rating dan jarak
  const formattedRating = parseFloat(rating).toFixed(1);
  const formattedJarak = parseFloat(jarak).toFixed(1);
  
  return (
    <Card>
      {cluster !== undefined && <Badge>{cluster_label || clusterNames[cluster] || `Cluster ${cluster}`}</Badge>}
      <Title>{nama}</Title>
      
      <InfoItem>
        <FaMapMarkerAlt />
        {isUrl(alamat) ? (
          <MapLink href={alamat} target="_blank" rel="noopener noreferrer">
            Lihat di Maps
          </MapLink>
        ) : (alamat || 'Lokasi tidak tersedia')}
      </InfoItem>
      
      <InfoItem>
        <FaMoneyBillWave />
        Harga: <b>{formatPrice(harga)}</b>
      </InfoItem>
      
      <InfoItem>
        <FaStar />
        Rating: <b>{formattedRating}</b>
      </InfoItem>
      
      <InfoItem>
        <FaWalking />
        Jarak: <b>{formattedJarak} km</b>
      </InfoItem>
      
      {kategori && (
        <InfoItem style={{ marginTop: 'auto' }}>
          Kategori: <b>{kategori}</b>
        </InfoItem>
      )}
    </Card>
  );
};

export default ResultCard;