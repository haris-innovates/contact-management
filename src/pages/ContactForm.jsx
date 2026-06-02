import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  useEffect(() => {
    if (isEdit) {
      getContactById(id).then(res => setForm(res.data)).catch(console.error);
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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

  const removePhone = (index) => {
    const phones = form.phoneNumbers.filter((_, i) => i !== index);
    setForm({ ...form, phoneNumbers: phones });
  };

  const removeEmail = (index) => {
    const emails = form.emailAddresses.filter((_, i) => i !== index);
    setForm({ ...form, emailAddresses: emails });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateContact(id, form);
        toast.success('Contact updated successfully!');
      } else {
        await createContact(form);
        toast.success('Contact created successfully!');
      }
      setTimeout(() => navigate('/contacts'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <ToastContainer position="top-right" autoClose={3000} />
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
          <div>
            <h1 style={styles.pageTitle}>{isEdit ? 'Edit Contact' : 'New Contact'}</h1>
            <p style={styles.pageSubtitle}>{isEdit ? 'Update contact details' : 'Add a new contact'}</p>
          </div>
          <button style={styles.backBtn} onClick={() => navigate('/contacts')}>
            ← Back
          </button>
        </div>

        <div style={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <h3 style={styles.section}>Basic Information</h3>
            <div style={styles.row}>
              <div style={{ ...styles.field, flex: 1, marginRight: '1rem' }}>
                <label style={styles.label}>First Name *</label>
                <input style={styles.input} type="text" name="firstName"
                  placeholder="John" value={form.firstName}
                  onChange={handleChange} required />
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Last Name *</label>
                <input style={styles.input} type="text" name="lastName"
                  placeholder="Doe" value={form.lastName}
                  onChange={handleChange} required />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Title</label>
              <input style={styles.input} type="text" name="title"
                placeholder="Mr, Mrs, Dr, etc." value={form.title}
                onChange={handleChange} />
            </div>

            <h3 style={styles.section}>Phone Numbers</h3>
            {form.phoneNumbers?.map((p, i) => (
              <div key={i} style={styles.inputRow}>
                <input style={{ ...styles.input, flex: 2 }} type="text"
                  placeholder="Phone number" value={p.number}
                  onChange={(e) => handlePhoneChange(i, 'number', e.target.value)} />
                <select style={{ ...styles.input, flex: 1 }} value={p.label}
                  onChange={(e) => handlePhoneChange(i, 'label', e.target.value)}>
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="home">Home</option>
                </select>
                {form.phoneNumbers.length > 1 && (
                  <button type="button" style={styles.removeBtn}
                    onClick={() => removePhone(i)}>✕</button>
                )}
              </div>
            ))}
            <button type="button" style={styles.addFieldBtn}
              onClick={() => setForm({ ...form, phoneNumbers: [...form.phoneNumbers, { number: '', label: 'personal' }] })}>
              + Add Phone
            </button>

            <h3 style={styles.section}>Email Addresses</h3>
            {form.emailAddresses?.map((e, i) => (
              <div key={i} style={styles.inputRow}>
                <input style={{ ...styles.input, flex: 2 }} type="email"
                  placeholder="Email address" value={e.email}
                  onChange={(ev) => handleEmailChange(i, 'email', ev.target.value)} />
                <select style={{ ...styles.input, flex: 1 }} value={e.label}
                  onChange={(ev) => handleEmailChange(i, 'label', ev.target.value)}>
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                </select>
                {form.emailAddresses.length > 1 && (
                  <button type="button" style={styles.removeBtn}
                    onClick={() => removeEmail(i)}>✕</button>
                )}
              </div>
            ))}
            <button type="button" style={styles.addFieldBtn}
              onClick={() => setForm({ ...form, emailAddresses: [...form.emailAddresses, { email: '', label: 'personal' }] })}>
              + Add Email
            </button>

            <div style={styles.formActions}>
              <button style={styles.cancelBtn} type="button"
                onClick={() => navigate('/contacts')}>Cancel</button>
              <button style={styles.saveBtn} type="submit" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Contact' : 'Create Contact'}
              </button>
            </div>
          </form>
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
  pageSubtitle: { color: '#636e72', marginTop: '0.25rem' },
  backBtn: { padding: '10px 20px', background: 'white', border: '2px solid #6c5ce7', color: '#6c5ce7', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  formCard: { background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', maxWidth: '700px' },
  section: { fontSize: '1rem', fontWeight: '600', color: '#6c5ce7', marginBottom: '1rem', marginTop: '1.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid #f0f0ff' },
  row: { display: 'flex' },
  field: { marginBottom: '1.2rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2d3436', fontSize: '14px' },
  input: { width: '100%', padding: '12px 16px', border: '2px solid #dfe6e9', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', marginRight: '0.5rem' },
  inputRow: { display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' },
  removeBtn: { padding: '8px 12px', background: '#fff0f0', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  addFieldBtn: { padding: '8px 16px', background: '#f0f0ff', color: '#6c5ce7', border: '1px solid #6c5ce7', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', marginBottom: '1rem' },
  formActions: { display: 'flex', gap: '1rem', marginTop: '2rem' },
  saveBtn: { flex: 1, padding: '14px', background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '16px' },
  cancelBtn: { padding: '14px 24px', background: '#f5f6fa', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#636e72', fontSize: '16px' },
};