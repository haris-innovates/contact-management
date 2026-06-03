import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    email: '', phoneNumber: '', password: '',
    firstName: '', lastName: ''
  });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (form.password.length < 8) {
    toast.error('Password must be at least 8 characters');
    setLoading(false);
    return;
  }
  if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(form.password)) {
    toast.error('Password must contain letters and numbers');
    setLoading(false);
    return;
  }
  if (!form.email && !form.phoneNumber) {
    toast.error('Please provide email or phone number');
    setLoading(false);
    return;
  }

  try {
    const res = await register(form);
    loginUser(res.data.token, null);
    toast.success('Account created successfully!');
    setTimeout(() => navigate('/contacts'), 1000);
  } catch (err) {
    toast.error(err.response?.data?.message || 'Registration failed');
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
          <p style={styles.brandSub}>Your personal contact manager</p>
          <div style={styles.features}>
            <p style={styles.feature}>✓ Store unlimited contacts</p>
            <p style={styles.feature}>✓ Search and filter easily</p>
            <p style={styles.feature}>✓ Secure and private</p>
          </div>
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.formBox}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join ContactHub today</p>
          <form onSubmit={handleSubmit}>
            <div style={styles.row}>
              <div style={{ ...styles.field, flex: 1, marginRight: '1rem' }}>
                <label style={styles.label}>First Name</label>
                <input style={styles.input} type="text" name="firstName"
                  placeholder="John" value={form.firstName}
                  onChange={handleChange} required />
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Last Name</label>
                <input style={styles.input} type="text" name="lastName"
                  placeholder="Doe" value={form.lastName}
                  onChange={handleChange} required />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input style={styles.input} type="email" name="email"
                placeholder="john@example.com" value={form.email}
                onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Phone Number</label>
              <input style={styles.input} type="text" name="phoneNumber"
                placeholder="03001234567" value={form.phoneNumber}
                onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} type="password" name="password"
                placeholder="Create a strong password" value={form.password}
                onChange={handleChange} required />
            </div>
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p style={styles.link}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  left: {
    flex: 1,
    background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
  },
  brand: { textAlign: 'center', color: 'white' },
  brandTitle: { fontSize: '3rem', fontWeight: '700', marginBottom: '1rem' },
  brandSub: { fontSize: '1.2rem', opacity: 0.9, marginBottom: '2rem' },
  features: { textAlign: 'left' },
  feature: { fontSize: '1.1rem', marginBottom: '0.8rem', opacity: 0.9 },
  right: {
    flex: 1, display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '2rem', background: 'white',
  },
  formBox: { width: '100%', maxWidth: '450px' },
  title: { fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#2d3436' },
  subtitle: { color: '#636e72', marginBottom: '2rem' },
  row: { display: 'flex' },
  field: { marginBottom: '1.2rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2d3436', fontSize: '14px' },
  input: {
    width: '100%', padding: '12px 16px', border: '2px solid #dfe6e9',
    borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
  },
  button: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem',
  },
  link: { textAlign: 'center', marginTop: '1.5rem', color: '#636e72' },
};