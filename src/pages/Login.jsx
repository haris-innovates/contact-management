import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form);
      loginUser(res.data.token, null);
      navigate('/contacts');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            name="identifier"
            placeholder="Email or Phone"
            value={form.identifier}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.link}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', height: '100vh', background: '#f0f2f5'
  },
  card: {
    background: 'white', padding: '2rem', borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '350px'
  },
  title: { textAlign: 'center', marginBottom: '1.5rem', color: '#333' },
  input: {
    width: '100%', padding: '10px', marginBottom: '1rem',
    border: '1px solid #ddd', borderRadius: '4px',
    fontSize: '14px', boxSizing: 'border-box'
  },
  button: {
    width: '100%', padding: '10px', background: '#1890ff',
    color: 'white', border: 'none', borderRadius: '4px',
    fontSize: '16px', cursor: 'pointer'
  },
  error: { color: 'red', textAlign: 'center', marginBottom: '1rem' },
  link: { textAlign: 'center', marginTop: '1rem' }
};