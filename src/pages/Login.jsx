import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.token, null);
      toast.success('Login successful!');
      setTimeout(() => navigate('/contacts'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={styles.left}>
        <div style={styles.brand}>
          <h1 style={styles.brandTitle}>ContactHub</h1>
          <p style={styles.brandSub}>Manage your contacts efficiently</p>
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.formBox}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to your account</p>
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Email or Phone</label>
              <input
                style={styles.input}
                type="text"
                name="identifier"
                placeholder="Enter your email or phone"
                value={form.identifier}
                onChange={handleChange}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p style={styles.link}>
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
  },
  left: {
    flex: 1,
    background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  brand: {
    textAlign: 'center',
    color: 'white',
  },
  brandTitle: {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '1rem',
  },
  brandSub: {
    fontSize: '1.2rem',
    opacity: 0.9,
  },
  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'white',
  },
  formBox: {
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: '#2d3436',
  },
  subtitle: {
    color: '#636e72',
    marginBottom: '2rem',
  },
  field: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#2d3436',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #dfe6e9',
    borderRadius: '8px',
    fontSize: '15px',
    transition: 'border-color 0.2s',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  link: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#636e72',
  },
};