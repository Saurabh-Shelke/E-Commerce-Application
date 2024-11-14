// src/pages/HomePage.js

import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(response => setProducts(response.data));
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <div className="product-list">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
