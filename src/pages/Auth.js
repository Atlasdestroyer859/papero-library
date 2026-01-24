import React, { useState } from 'react';

const Auth = ({ onAuthSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isSignup ? 'http://localhost:5000/api/signup' : 'http://localhost:5000/api/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        onAuthSuccess(data.user); // Pass full user object
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
        <p style={styles.subtitle}>
          {isSignup ? 'Join the paperless revolution.' : 'Your digital library awaits.'}
        </p>

        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              style={styles.input}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            style={styles.input}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <button type="submit" style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        {/* Toggle View */}
        <p style={styles.toggleText}>
          {isSignup ? 'Already a member?' : 'New to the store?'}
          <span onClick={() => { setIsSignup(!isSignup); setError(''); }} style={styles.link}>
            {isSignup ? ' Login here' : ' Create account'}
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '50px', animation: 'fadeIn 0.5s ease' },
  card: { width: '100%', maxWidth: '400px', padding: '40px', borderRadius: '30px', backgroundColor: '#fff', border: '1px solid #eee', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
  title: { fontSize: '28px', color: '#333', marginBottom: '10px', textAlign: 'center' },
  subtitle: { color: '#888', marginBottom: '30px', textAlign: 'center', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '15px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' },
  submitBtn: { padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#FF6B6B', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' },
  toggleText: { marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' },
  link: { color: '#82D8FF', fontWeight: 'bold', cursor: 'pointer' }
};

export default Auth;