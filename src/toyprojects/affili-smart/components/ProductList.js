// src/toyprojects/affili-smart/components/ProductList.js

import React from 'react';
import styled from 'styled-components';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProductItem = styled.div`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const ProductList = ({ products = [] }) => {
  if (!Array.isArray(products)) {
    return <div>상품 데이터가 올바르지 않습니다.</div>;
  }

  return (
    <List>
      {products.map((product, index) => (
        <ProductItem key={index}>
          <h3>{product.title}</h3>
          <p>가격: {product.price.toLocaleString()}원</p>
          <p>평점: {product.rating}</p>
        </ProductItem>
      ))}
    </List>
  );
};

export default ProductList;