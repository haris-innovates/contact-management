import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getContactById } from '../services/api';

export default function ContactView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);

  useEffect(() => {
    getContactById(id).then(res => setContact(res.data)).catch(console.error);
  }, [id]);

  if (!contact) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Loading...</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>ContactHub</h2>
        <nav>
          <div style={{ ...styles.navItem, ...styles.navInactive }}
            onClick={() => navigate('/contacts')}>📋 Contacts</div>
          <div style={{ ...styles.navItem, ...styles.navInactive }}
            onClick={() => navigate('/profile')}>👤 Profile</div>
        </nav>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Contact Details</h1>
          <div style={styles.headerActions}>
            <button style={styles.editBtn}
              onClick={() => navigate(`/contacts/edit/${id}`)}>
              ✏️ Edit
            </button>
            <button style={styles.backBtn} onClick={() => navigate('/contacts')}>
              ← Back
            </button>
          </div>
        </div>

        <div style={styles.content}>
          <div style={styles.profileSection}>
            <div style={styles.avatar}>
              {contact.firstName?.[0]}{contact.lastName?.[0]}
            </div>
            <h2 style={styles.name}>{contact.firstName} {contact.lastName}</h2>
            {contact.title && <p style={styles.title}>{contact.title}</p>}
          </div>

          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>📞 Phone Numbers</h3>
              {contact.phoneNumbers?.length === 0 ? (
                <p style={styles.empty}>No phone numbers</p>
              ) : (
                contact.phoneNumbers?.map((p, i) => (
                  <div key={i} style={styles.infoItem}>
                    <span style={styles.infoValue}>{p.number}</span>
                    <span style={styles.badge}>{p.label}</span>
                  </div>
                ))
              )}
            </div>

            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>✉️ Email Addresses</h3>
              {contact.emailAddresses?.length === 0 ? (
                <p style={styles.empty}>No email addresses</p>
              ) : (
                contact.emailAddresses?.map((e, i) => (
                  <div key={i} style={styles.infoItem}>
                    <span style={styles.infoValue}>{e.email}</span>
                    <span style={styles.badge}>{e.label}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#f5f6fa' },
  sidebar: { width: '250px', background: 'linear-gradient(180deg, #6c5ce7 0%, #a29bfe 100%)', padding: '2rem 1.5rem', color: 'white', position: 'fixed', top: 0, left: 0, height: '100vh' },
  logo: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' },
  navItem: { padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.2)', fontWeight: '500' },
  navInactive: { background: 'transparent', opacity: 0.8 },
  main: { marginLeft: '250px', flex: 1, padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  pageTitle: { fontSize: '1.8rem', fontWeight: '700', color: '#2d3436' },
  headerActions: { display: 'flex', gap: '0.75rem' },
  editBtn: { padding: '10px 20px', background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  backBtn: { padding: '10px 20px', background: 'white', border: '2px solid #6c5ce7', color: '#6c5ce7', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  content: { maxWidth: '800px' },
  profileSection: { background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center', marginBottom: '1.5rem' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '700', margin: '0 auto 1rem' },
  name: { fontSize: '1.8rem', fontWeight: '700', color: '#2d3436', marginBottom: '0.5rem' },
  title: { color: '#636e72', fontSize: '1.1rem' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  infoCard: { background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  infoTitle: { fontSize: '1rem', fontWeight: '600', color: '#2d3436', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #f0f0ff' },
  infoItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f5f6fa' },
  infoValue: { color: '#2d3436', fontWeight: '500' },
  badge: { background: '#f0f0ff', color: '#6c5ce7', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  empty: { color: '#636e72', fontStyle: 'italic' },
};