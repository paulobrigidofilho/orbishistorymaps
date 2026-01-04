///////////////////////////////////////////////////////////////////////
// ===================== LOGIN MODAL COMPONENT ===================== //
///////////////////////////////////////////////////////////////////////

// This component renders a modal for user login, handling email and password input,
// and providing feedback for login errors.

//  ========== Module imports  ========== //
import styles from "./Auth.module.css"; 
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

//  ========== Button imports  ========== //
import { SubmitBtn, CloseBtn, LinkBtn } from './btn';

//  ========== Function imports  ========== //
import handleSubmitLogin from './functions/handleSubmitLogin';

// ========================= STATE VARIABLES ========================= //

function LoginModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext); // Get login function from context
  const navigate = useNavigate(); // Get navigate function for redirects

  // Handler function with proper context
  const handleSubmitWithContext = (e) => {
    const credentials = { email, password };
    handleSubmitLogin(e, credentials, login, setError, onClose, navigate);
  };

///////////////////////////////////////////////////////////////////////
// ========================= JSX BELOW ============================= //
///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.loginModal}>
      <div className={styles.modalContent}>
        <h2 className={styles.loginTitle}>Log In</h2>
        <CloseBtn onClick={onClose} />
        
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

            <LinkBtn variant="forgot" onClick={onClose} />
            
            <SubmitBtn variant="login" />
          </div>
        </form>
        
        <LinkBtn variant="register" />
      </div>
    </div>
  );
}

export default LoginModal;