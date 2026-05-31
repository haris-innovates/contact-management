import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createContact, updateContact, getContactById } from '../services/api';

export default function ContactForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', title: '',
    phoneNumbers: [{ number: '', label: 'personal' }],
    emailAddresses: [{ email: '', label: 'personal' }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      getContactById(id).then(res => setForm(res.data)).catch(console.error);
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (index, field, value) => {
    const phones = [...form.phoneNumbers];
    phones[index][field] = value;
    setForm({ ...form, phoneNumbers: phones });
  };

  const handleEmailChange = (index, field, value) => {
    const emails = [...form.emailAddresses];
    emails[index][field] = value;
    setForm({ ...form, emailAddresses: emails });
  };

  const addPhone = () => {
    setForm({ ...form, phoneNumbers: [...form.phoneNumbers, { number: '', label: 'personal' }] });
  };

  const addEmail = () => {
    setForm({ ...form, emailAddresses: [...form.emailAddresses, { email: '', label: 'personal' }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await updateContact(id, form);
      } else {
        await createContact(form);
      }
      navigate('/contacts');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isEdit ? 'Edit Contact' : 'New Contact'}</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="text" name="firstName"
            placeholder="First Name" value={form.firstName}
            onChange={handleChange} required />
          <input style={styles.input} type="text" name="lastName"
            placeholder="Last Name" value={form.lastName}
            onChange={handleChange} required />
          <input style={styles.input} type="text" name="title"
            placeholder="Title" value={form.title}
            onChange={handleChange} />

          <h4>Phone Numbers</h4>
          {form.phoneNumbers?.map((p, i) => (
            <div key={i} style={styles.row}>
              <input style={{ ...styles.input, flex: 2, marginRight: '8px' }}
                type="text" placeholder="Phone number"
                value={p.number}
                onChange={(e) => handlePhoneChange(i, 'number', e.target.value)} />
              <select style={{ ...styles.input, flex: 1 }}
                value={p.label}
                onChange={(e) => handlePhoneChange(i, 'label', e.target.value)}>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="home">Home</option>
              </select>
            </div>
          ))}
          <button type="button" style={styles.addBtn} onClick={addPhone}>+ Add Phone</button>

          <h4>Email Addresses</h4>
          {form.emailAddresses?.map((e, i) => (
            <div key={i} style={styles.row}>
              <input style={{ ...styles.input, flex: 2, marginRight: '8px' }}
                type="email" placeholder="Email address"
                value={e.email}
                onChange={(ev) => handleEmailChange(i, 'email', ev.target.value)} />
              <select style={{ ...styles.input, flex: 1 }}
                value={e.label}
                onChange={(ev) => handleEmailChange(i, 'label', ev.target.value)}>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
              </select>
            </div>
          ))}
          <button type="button" style={styles.addBtn} onClick={addEmail}>+ Add Email</button>

          <div style={styles.actions}>
            <button style={styles.saveBtn} type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button style={styles.cancelBtn} type="button"
              onClick={() => navigate('/contacts')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '2rem', background: '#f0f2f5', minHeight: '100vh' },
  card: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '500px' },
  title: { textAlign: 'center', marginBottom: '1.5rem', color: '#333' },
  input: { width: '100%', padding: '10px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' },
  row: { display: 'flex', alignItems: 'center', marginBottom: '0.5rem' },
  addBtn: { padding: '6px 12px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '1rem' },
  actions: { display: 'flex', gap: '1rem', marginTop: '1rem' },
  saveBtn: { flex: 1, padding: '10px', background: '#52c41a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  cancelBtn: { flex: 1, padding: '10px', background: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  error: { color: 'red', textAlign: 'center', marginBottom: '1rem' },
};