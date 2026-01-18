import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReservationList from './pages/Reservations/ReservationList';
import ReservationForm from './pages/Reservations/ReservationForm';
// import CustomerList from './pages/Customers/CustomerList';
// import CustomerForm from './pages/Customers/CustomerForm';
import AccommodationList from './pages/Accommodations/AccommodationList';
import UserList from './pages/Users/UserList';

// Layout
import Layout from './components/layout/Layout';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();

  // user null ise login sayfasına yönlendir
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  const { user } = useAuthStore();
  const [hasUsers, setHasUsers] = useState(null); // null = loading

  useEffect(() => {
    const checkUsers = async () => {
      if (!window.electronAPI) {
        console.log('Electron API yok, web ortamında çalışıyorsun');
        return;
      }
      const users = await window.electronAPI.usersList();
      setHasUsers(users.length > 0);
    };
    checkUsers();
  }, []);

  if (hasUsers === null) {
    return (
      <div className="text-white text-2xl text-center mt-40">Yükleniyor...</div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />

        <Route path="/register" element={<Register />} />

        {/* TÜM KORUMALI SAYFALAR (Layout içinde) */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Ana Sayfa */}
          <Route path="/" element={<Dashboard />} />

          {/* Rezervasyonlar */}
          <Route path="/reservations" element={<ReservationList />} />
          <Route path="/reservations/new" element={<ReservationForm />} />
          <Route path="/reservations/edit/:id" element={<ReservationForm />} />

          {/* Müşteriler
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/new" element={<CustomerForm />} />
          <Route path="/customers/edit/:id" element={<CustomerForm />} /> */}

          {/* Konaklama Birimleri */}
          <Route path="/accommodations" element={<AccommodationList />} />

          {/* Personel */}
          <Route path="/users" element={<UserList />} />
        </Route>

        {/* Yanlış adres → Ana sayfaya yönlendir */}
        <Route
          path="*"
          element={<Navigate to={user ? '/' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
