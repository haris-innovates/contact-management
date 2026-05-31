import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    email: '', phoneNumber: '', password: '',
    firstName: '', lastName: ''
  });
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
      const res = await register(form);
      loginUser(res.data.token, null);
      navigate('/contacts');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="text" name="firstName"
            placeholder="First Name" value={form.firstName}
            onChange={handleChange} required />
          <input style={styles.input} type="text" name="lastName"
            placeholder="Last Name" value={form.lastName}
            onChange={handleChange} required />
          <input style={styles.input} type="email" name="email"
            placeholder="Email" value={form.email}
            onChange={handleChange} />
          <input style={styles.input} type="text" name="phoneNumber"
            placeholder="Phone Number" value={form.phoneNumber}
            onChange={handleChange} />
          <input style={styles.input} type="password" name="password"
            placeholder="Password" value={form.password}
            onChange={handleChange} required />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={styles.link}>
          Already have an account? <Link to="/login">Login</Link>
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
    width: '100%', padding: '10px', background: '#52c41a',
    color: 'white', border: 'none', borderRadius: '4px',
    fontSize: '16px', cursor: 'pointer'
  },
  error: { color: 'red', textAlign: 'center', marginBottom: '1rem' },
  link: { textAlign: 'center', marginTop: '1rem' }
};