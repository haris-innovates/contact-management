import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getProfile, changePassword } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile().then(res => setProfile(res.data)).catch(console.error);
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await changePassword(passwordForm);
      toast.success('Password changed successfully!');
      setShowChangePassword(false);
      setPasswordForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div style={styles.page}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>ContactHub</h2>
        <nav>
          <div style={{ ...styles.navItem, ...styles.navInactive }}
            onClick={() => navigate('/contacts')}>
            📋 Contacts
          </div>
          <div style={styles.navItem}>👤 Profile</div>
        </nav>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <h1 style={styles.pageTitle}>My Profile</h1>

        <div style={styles.content}>
          {/* Profile Card */}
          <div style={styles.profileCard}>
            <div style={styles.avatarLarge}>
              {profile ? `${profile.firstName?.[0]}${profile.lastName?.[0]}` : '?'}
            </div>
            <h2 style={styles.profileName}>
              {profile ? `${profile.firstName} ${profile.lastName}` : 'Loading...'}
            </h2>
            <p style={styles.profileEmail}>{profile?.email}</p>
            {profile?.phoneNumber && (
              <p style={styles.profilePhone}>📞 {profile.phoneNumber}</p>
            )}

            <div style={styles.profileActions}>
              <button style={styles.passwordBtn}
                onClick={() => setShowChangePassword(!showChangePassword)}>
                🔒 Change Password
              </button>
              <button style={styles.logoutBtn} onClick={logoutUser}>
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Change Password Form */}
          {showChangePassword && (
            <div style={styles.passwordCard}>
              <h3 style={styles.cardTitle}>Change Password</h3>
              <form onSubmit={handlePasswordChange}>
                <div style={styles.field}>
                  <label style={styles.label}>Current Password</label>
                  <input style={styles.input} type="password"
                    placeholder="Enter current password"
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    required />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>New Password</label>
                  <input style={styles.input} type="password"
                    placeholder="Enter new password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required />
                </div>
                <div style={styles.formActions}>
                  <button style={styles.saveBtn} type="submit">Update Password</button>
                  <button style={styles.cancelBtn} type="button"
                    onClick={() => setShowChangePassword(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#f5f6fa' },
  sidebar: {
    width: '250px', background: 'linear-gradient(180deg, #6c5ce7 0%, #a29bfe 100%)',
    padding: '2rem 1.5rem', color: 'white', position: 'fixed', top: 0, left: 0, height: '100vh',
  },
  logo: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' },
  navItem: { padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.2)', fontWeight: '500' },
  navInactive: { background: 'transparent', opacity: 0.8 },
  main: { marginLeft: '250px', flex: 1, padding: '2rem' },
  pageTitle: { fontSize: '1.8rem', fontWeight: '700', color: '#2d3436', marginBottom: '1.5rem' },
  content: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
  profileCard: {
    background: 'white', borderRadius: '16px', padding: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center',
    width: '320px',
  },
  avatarLarge: {
    width: '80px', height: '80px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
    color: 'white', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '2rem', fontWeight: '700',
    margin: '0 auto 1rem',
  },
  profileName: { fontSize: '1.4rem', fontWeight: '700', color: '#2d3436', marginBottom: '0.5rem' },
  profileEmail: { color: '#636e72', marginBottom: '0.5rem' },
  profilePhone: { color: '#636e72', marginBottom: '1.5rem' },
  profileActions: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  passwordBtn: {
    padding: '12px', background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
    color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600',
  },
  logoutBtn: {
    padding: '12px', background: '#fff0f0', color: '#e74c3c',
    border: '1px solid #e74c3c', borderRadius: '8px', cursor: 'pointer', fontWeight: '600',
  },
  passwordCard: {
    background: 'white', borderRadius: '16px', padding: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flex: 1, minWidth: '300px',
  },
  cardTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#2d3436', marginBottom: '1.5rem' },
  field: { marginBottom: '1.2rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2d3436', fontSize: '14px' },
  input: { width: '100%', padding: '12px 16px', border: '2px solid #dfe6e9', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
  formActions: { display: 'flex', gap: '1rem' },
  saveBtn: { flex: 1, padding: '12px', background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  cancelBtn: { flex: 1, padding: '12px', background: '#f5f6fa', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#636e72' },
};