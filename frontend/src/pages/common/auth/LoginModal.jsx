//  ========== Component imports  ========== //
import styles from "./Auth.module.css"; 
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { NavLink } from 'react-router-dom';

//  ==========  FUNCTIONS SECTION ========== //

function LoginModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext); // Get login function from context

////////////////////////////////////////////////////////////////////////
// ========================= LOGIN FUNCTION ========================= //
// ======= handleSubmit handles the form submission for login ======= //
////////////////////////////////////////////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      await login(email, password); // Call the login function from AuthContext
      
      onClose(); // Close the modal on successful login
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    }
  };

    ///////////////////////////////////////////////////////////////////////
    // ========================= JSX BELOW ============================= //
    ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.loginModal}>
      <div className={styles.modalContent}>
        <h2 className={styles.loginTitle}>Log In</h2>
        <button onClick={onClose} className={styles.closeButton}>×</button>
        
        <form onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Email:</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
            />
            
            <p className={styles.inputLabel}>Password:</p>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
            />
            
            <button type="submit" className={styles.loginButton}>
              Log In
            </button>
          </div>
        </form>
        
        <div className={styles.registerLink}>
          Not a user? <NavLink to="/register">Register here</NavLink>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;