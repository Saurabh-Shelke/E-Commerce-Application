// src/components/ProductCard.js

import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <Link to={`/products/${product._id}`}>View Product</Link>
    </div>
  );
}

export default ProductCard;
