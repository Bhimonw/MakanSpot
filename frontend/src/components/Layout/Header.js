import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.fontWeights.extrabold};
  letter-spacing: 1px;
  font-size: 2rem;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Title>🍽️ Rekomendasi Tempat Makan</Title>
    </HeaderContainer>
  );
};

export default Header;