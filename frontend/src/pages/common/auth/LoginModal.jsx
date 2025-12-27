///////////////////////////////////////
// ===== LOGIN MODAL COMPONENT ===== //
///////////////////////////////////////

// This component renders a modal for user login, handling email and password input,
// and providing feedback for login errors.

//  ========== Module imports  ========== //
import styles from "./Auth.module.css"; 
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { NavLink } from 'react-router-dom';

//  ========== Function imports  ========== //
import handleSubmitLogin from './functions/handleSubmitLogin';

// ========================= STATE VARIABLES ========================= //

function LoginModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext); // Get login function from context

  // Handler function with proper context
  const handleSubmitWithContext = (e) => {
    const credentials = { email, password };
    handleSubmitLogin(e, credentials, login, setError, onClose);
  };

///////////////////////////////////////////////////////////////////////
// ========================= JSX BELOW ============================= //
///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.loginModal}>
      <div className={styles.modalContent}>
        <h2 className={styles.loginTitle}>Log In</h2>
        <button onClick={onClose} className={styles.closeButton}>×</button>
        
        <form onSubmit={handleSubmitWithContext}>
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

            <div className={styles.forgotPasswordLink}>
              <NavLink to="/forgot-password" onClick={onClose}>
                Forgot Password?
              </NavLink>
            </div>
            
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