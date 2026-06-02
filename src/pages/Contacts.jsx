import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getContacts, deleteContact } from '../services/api';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await getContacts(page, 10, search);
      setContacts(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, [page, search]);

  const handleDelete = async () => {
    try {
      await deleteContact(deleteId);
      setDeleteId(null);
      toast.success('Contact deleted successfully');
      fetchContacts();
    } catch (err) {
      toast.error('Failed to delete contact');
    }
  };

  return (
    <div style={styles.page}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>ContactHub</h2>
        <nav>
          <div style={styles.navItem}>📋 Contacts</div>
          <div style={{ ...styles.navItem, ...styles.navInactive }}
            onClick={() => navigate('/profile')}>
            👤 Profile
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.topbar}>
          <div>
            <h1 style={styles.pageTitle}>My Contacts</h1>
            <p style={styles.pageSubtitle}>{contacts.length} contacts found</p>
          </div>
          <button style={styles.addBtn} onClick={() => navigate('/contacts/new')}>
            + Add Contact
          </button>
        </div>

        <div style={styles.searchBox}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="🔍  Search contacts by name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          />
        </div>

        {loading ? (
          <div style={styles.loading}>Loading contacts...</div>
        ) : contacts.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}>📭</p>
            <p>No contacts found</p>
            <button style={styles.addBtn} onClick={() => navigate('/contacts/new')}>
              Add your first contact
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {contacts.map((c) => (
              <div key={c.id} style={styles.card}>
                <div style={styles.avatar}>
                  {c.firstName[0]}{c.lastName[0]}
                </div>
                <div style={styles.cardInfo}>
                  <h3 style={styles.cardName}>{c.firstName} {c.lastName}</h3>
                  <p style={styles.cardTitle}>{c.title || 'No title'}</p>
                  {c.phoneNumbers?.[0] && (
                    <p style={styles.cardDetail}>📞 {c.phoneNumbers[0].number}</p>
                  )}
                  {c.emailAddresses?.[0] && (
                    <p style={styles.cardDetail}>✉️ {c.emailAddresses[0].email}</p>
                  )}
                </div>
                <div style={styles.cardActions}>
                  <button style={styles.viewBtn}
                    onClick={() => navigate(`/contacts/view/${c.id}`)}>View</button>
                  <button style={styles.editBtn}
                    onClick={() => navigate(`/contacts/edit/${c.id}`)}>Edit</button>
                  <button style={styles.deleteBtn}
                    onClick={() => setDeleteId(c.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button style={styles.pageBtn} disabled={page === 0}
              onClick={() => setPage(page - 1)}>← Previous</button>
            <span style={styles.pageInfo}>Page {page + 1} of {totalPages}</span>
            <button style={styles.pageBtn} disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}>Next →</button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalIcon}>🗑️</div>
            <h3 style={styles.modalTitle}>Delete Contact</h3>
            <p style={styles.modalText}>Are you sure you want to delete this contact? This action cannot be undone.</p>
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setDeleteId(null)}>Cancel</button>
              <button style={styles.confirmBtn} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#f5f6fa' },
  sidebar: {
    width: '250px', background: 'linear-gradient(180deg, #6c5ce7 0%, #a29bfe 100%)',
    padding: '2rem 1.5rem', color: 'white', position: 'fixed',
    top: 0, left: 0, height: '100vh',
  },
  logo: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' },
  navItem: {
    padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
    marginBottom: '0.5rem', background: 'rgba(255,255,255,0.2)',
    fontWeight: '500',
  },
  navInactive: { background: 'transparent', opacity: 0.8 },
  main: { marginLeft: '250px', flex: 1, padding: '2rem' },
  topbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  pageTitle: { fontSize: '1.8rem', fontWeight: '700', color: '#2d3436' },
  pageSubtitle: { color: '#636e72', marginTop: '0.25rem' },
  addBtn: {
    padding: '12px 24px', background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer',
  },
  searchBox: { marginBottom: '1.5rem' },
  searchInput: {
    width: '100%', padding: '14px 20px', border: '2px solid #dfe6e9',
    borderRadius: '10px', fontSize: '15px', outline: 'none',
    background: 'white', boxSizing: 'border-box',
  },
  loading: { textAlign: 'center', padding: '3rem', color: '#636e72', fontSize: '1.1rem' },
  empty: { textAlign: 'center', padding: '4rem', color: '#636e72' },
  emptyIcon: { fontSize: '4rem', marginBottom: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' },
  card: {
    background: 'white', borderRadius: '12px', padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex',
    flexDirection: 'column', gap: '1rem',
  },
  avatar: {
    width: '56px', height: '56px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
    color: 'white', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '1.2rem', fontWeight: '700',
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: '1.1rem', fontWeight: '600', color: '#2d3436', marginBottom: '0.25rem' },
  cardTitle: { color: '#636e72', fontSize: '14px', marginBottom: '0.5rem' },
  cardDetail: { color: '#636e72', fontSize: '13px', marginBottom: '0.25rem' },
  cardActions: { display: 'flex', gap: '0.5rem' },
  viewBtn: { flex: 1, padding: '8px', background: '#f0f0ff', color: '#6c5ce7', border: '1px solid #6c5ce7', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' },
  editBtn: { flex: 1, padding: '8px', background: '#fff8e6', color: '#f39c12', border: '1px solid #f39c12', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' },
  deleteBtn: { flex: 1, padding: '8px', background: '#fff0f0', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' },
  pageBtn: { padding: '10px 20px', border: '2px solid #6c5ce7', borderRadius: '8px', cursor: 'pointer', color: '#6c5ce7', background: 'white', fontWeight: '500' },
  pageInfo: { color: '#636e72' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: 'white', borderRadius: '16px', padding: '2rem', width: '400px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalIcon: { fontSize: '3rem', marginBottom: '1rem' },
  modalTitle: { fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem', color: '#2d3436' },
  modalText: { color: '#636e72', marginBottom: '1.5rem', lineHeight: '1.6' },
  modalActions: { display: 'flex', gap: '1rem' },
  cancelBtn: { flex: 1, padding: '12px', background: '#f5f6fa', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#636e72' },
  confirmBtn: { flex: 1, padding: '12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
};