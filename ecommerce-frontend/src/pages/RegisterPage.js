// src/pages/RegisterPage.js

import React, { useState } from 'react';
import { registerUser } from '../services/api';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ username, email, password });
      alert('Registration Successful');
    } catch (error) {
      alert('Registration Failed');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
