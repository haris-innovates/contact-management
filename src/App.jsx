import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Contacts from './pages/Contacts';
import ContactForm from './pages/ContactForm';
import Profile from './pages/Profile';
import ContactView from './pages/ContactView';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contacts" element={<PrivateRoute><Contacts /></PrivateRoute>} />
          <Route path="/contacts/new" element={<PrivateRoute><ContactForm /></PrivateRoute>} />
          <Route path="/contacts/edit/:id" element={<PrivateRoute><ContactForm /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/contacts/view/:id" element={<PrivateRoute><ContactView /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;