import React, { useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailAuth = async () => {
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <input
        style={styles.input}
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button style={styles.button} onClick={handleEmailAuth}>
        {isRegistering ? 'Register' : 'Login'}
      </button>

      <hr style={styles.hr} />
      <button style={styles.googleBtn} onClick={handleGoogleLogin}>
        Login with Google
      </button>

      <p>
        {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Login here' : 'Register here'}
        </span>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 400,
    margin: 'auto',
    padding: 20,
    textAlign: 'center' as const,
    border: '1px solid #ddd',
    borderRadius: 10,
    marginTop: 100,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  input: {
    width: '90%',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    border: '1px solid #ccc',
  },
  button: {
    width: '95%',
    padding: 10,
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    marginBottom: 10,
  },
  googleBtn: {
    width: '95%',
    padding: 10,
    backgroundColor: '#db4437',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
  hr: {
    margin: '20px 0',
  },
};

export default Auth;
