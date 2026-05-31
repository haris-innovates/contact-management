import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, changePassword } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile().then(res => setProfile(res.data)).catch(console.error);
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await changePassword(passwordForm);
      setMessage('Password changed successfully!');
      setShowChangePassword(false);
      setPasswordForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>My Profile</h2>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        {profile && (
          <div style={styles.info}>
            <p><strong>First Name:</strong> {profile.firstName}</p>
            <p><strong>Last Name:</strong> {profile.lastName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phoneNumber || 'N/A'}</p>
          </div>
        )}

        <div style={styles.actions}>
          <button style={styles.backBtn} onClick={() => navigate('/contacts')}>
            Back to Contacts
          </button>
          <button style={styles.passwordBtn}
            onClick={() => setShowChangePassword(!showChangePassword)}>
            Change Password
          </button>
          <button style={styles.logoutBtn} onClick={logoutUser}>
            Logout
          </button>
        </div>

        {showChangePassword && (
          <form onSubmit={handlePasswordChange} style={styles.form}>
            <h4>Change Password</h4>
            <input style={styles.input} type="password"
              placeholder="Old Password"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              required />
            <input style={styles.input} type="password"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required />
            <div style={styles.formActions}>
              <button style={styles.saveBtn} type="submit">Reset</button>
              <button style={styles.cancelBtn} type="button"
                onClick={() => setShowChangePassword(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '2rem', background: '#f0f2f5', minHeight: '100vh' },
  card: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '450px' },
  title: { textAlign: 'center', marginBottom: '1.5rem', color: '#333' },
  info: { marginBottom: '1.5rem', lineHeight: '2' },
  actions: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  backBtn: { padding: '8px 16px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  passwordBtn: { padding: '8px 16px', background: '#faad14', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  logoutBtn: { padding: '8px 16px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  form: { borderTop: '1px solid #ddd', paddingTop: '1rem' },
  input: { width: '100%', padding: '10px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' },
  formActions: { display: 'flex', gap: '1rem' },
  saveBtn: { flex: 1, padding: '10px', background: '#52c41a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  cancelBtn: { flex: 1, padding: '10px', background: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  success: { color: 'green', textAlign: 'center', marginBottom: '1rem' },
  error: { color: 'red', textAlign: 'center', marginBottom: '1rem' },
};