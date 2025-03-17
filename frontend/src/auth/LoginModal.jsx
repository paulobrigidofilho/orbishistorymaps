//  ========== Component imports  ========== //
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

//  ==========  FUNCTIONS SECTION ========== //

function LoginModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext); // Get login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password); // Call the login function from AuthContext
      onClose(); // Close the modal on successful login
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className="login-modal">
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <p>
          Not a user? <a href="/register">Register here</a>
        </p>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default LoginModal;