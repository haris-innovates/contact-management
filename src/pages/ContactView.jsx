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

  if (!contact) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{contact.firstName} {contact.lastName}</h2>
        <p><strong>Title:</strong> {contact.title || 'N/A'}</p>

        <h4>Phone Numbers</h4>
        {contact.phoneNumbers?.length === 0 ? <p>No phone numbers</p> :
          contact.phoneNumbers?.map((p, i) => (
            <p key={i}>{p.number} <span style={styles.label}>{p.label}</span></p>
          ))}

        <h4>Email Addresses</h4>
        {contact.emailAddresses?.length === 0 ? <p>No emails</p> :
          contact.emailAddresses?.map((e, i) => (
            <p key={i}>{e.email} <span style={styles.label}>{e.label}</span></p>
          ))}

        <button style={styles.backBtn} onClick={() => navigate('/contacts')}>
          Back to Contacts
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '2rem', background: '#f0f2f5', minHeight: '100vh' },
  card: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '450px' },
  title: { textAlign: 'center', marginBottom: '1.5rem', color: '#333' },
  label: { background: '#1890ff', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', marginLeft: '8px' },
  backBtn: { marginTop: '1.5rem', padding: '8px 16px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};