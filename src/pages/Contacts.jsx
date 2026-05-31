import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, search]);

  const handleDelete = async () => {
    try {
      await deleteContact(deleteId);
      setDeleteId(null);
      fetchContacts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Contacts</h2>
        <div>
          <button style={styles.profileBtn} onClick={() => navigate('/profile')}>
            Profile
          </button>
          <button style={styles.addBtn} onClick={() => navigate('/contacts/new')}>
            + Add Contact
          </button>
        </div>
      </div>

      <input
        style={styles.search}
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
      />

      {loading ? <p>Loading...</p> : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>First Name</th>
              <th style={styles.th}>Last Name</th>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr><td colSpan="4" style={styles.noData}>No contacts found</td></tr>
            ) : (
              contacts.map((c) => (
                <tr key={c.id} style={styles.tr}>
                  <td style={styles.td}>{c.firstName}</td>
                  <td style={styles.td}>{c.lastName}</td>
                  <td style={styles.td}>{c.title}</td>
                  <td style={styles.td}>
                    <button style={styles.editBtn}
                      onClick={() => navigate(`/contacts/edit/${c.id}`)}>
                      Edit
                    </button>
                    <button style={styles.deleteBtn}
                      onClick={() => setDeleteId(c.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <div style={styles.pagination}>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}
          style={styles.pageBtn}>Previous</button>
        <span> Page {page + 1} of {totalPages} </span>
        <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}
          style={styles.pageBtn}>Next</button>
      </div>

      {deleteId && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this contact?</p>
            <button style={styles.deleteBtn} onClick={handleDelete}>Delete</button>
            <button style={styles.cancelBtn} onClick={() => setDeleteId(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  search: { width: '100%', padding: '10px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1890ff', color: 'white' },
  th: { padding: '12px', textAlign: 'left' },
  tr: { borderBottom: '1px solid #ddd' },
  td: { padding: '12px' },
  noData: { textAlign: 'center', padding: '2rem', color: '#999' },
  addBtn: { padding: '8px 16px', background: '#52c41a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' },
  profileBtn: { padding: '8px 16px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  editBtn: { padding: '6px 12px', background: '#faad14', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' },
  deleteBtn: { padding: '6px 12px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' },
  cancelBtn: { padding: '6px 12px', background: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' },
  pageBtn: { padding: '6px 12px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  modalBox: { background: 'white', padding: '2rem', borderRadius: '8px', textAlign: 'center' },
};