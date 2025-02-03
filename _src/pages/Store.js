import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import StoreComponent from '../components/home/Store';

const Store = () => {
  const navigate = useNavigate();

  const handlePurchase = (product) => {
    navigate('/payment', {
      state: {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          type: 'store',
          features: product.features
        }
      }
    });
  };

  return (
    <StorePage>
      <StoreComponent onPurchase={handlePurchase} />
    </StorePage>
  );
};

const StorePage = styled.div`
  padding-top: 80px;
`;

export default Store; 