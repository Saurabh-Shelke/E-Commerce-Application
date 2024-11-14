// src/services/api.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Example function to fetch products
export const fetchProducts = async () => {
  return api.get('/products');
};

// Fetch product details
export const fetchProductById = async (id) => {
  return api.get(`/products/${id}`);
};

// Register a user
export const registerUser = async (userData) => {
  return api.post('/register', userData);
};

// Login a user
export const loginUser = async (credentials) => {
  return api.post('/login', credentials);
};
