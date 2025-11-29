// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReservationList from './pages/Reservations/ReservationList';
import ReservationForm from './pages/Reservations/ReservationForm';
import CustomerList from './pages/Customers/CustomerList';
import CustomerForm from './pages/Customers/CustomerForm';
import AccommodationList from './pages/Accommodations/AccommodationList';
import UserList from './pages/Users/UserList';

// Layout
import Layout from './components/layout/Layout';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />

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

          {/* ==== REZERVASYONLAR (admin + resepsiyon) ==== */}
          <Route
            path="/reservations"
            element={
              <ProtectedRoute allowedRoles={['admin', 'resepsiyon']}>
                <ReservationList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations/new"
            element={
              <ProtectedRoute allowedRoles={['admin', 'resepsiyon']}>
                <ReservationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['admin', 'resepsiyon']}>
                <ReservationForm />
              </ProtectedRoute>
            }
          />

          {/* ==== MÜŞTERİLER (sadece admin) ==== */}
          <Route
            path="/customers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CustomerList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/new"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CustomerForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CustomerForm />
              </ProtectedRoute>
            }
          />

          {/* ==== KONAKLAMA BİRİMLERİ (sadece admin) ==== */}
          <Route
            path="/accommodations"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AccommodationList />
              </ProtectedRoute>
            }
          />

          {/* ==== PERSONEL (sadece admin) ==== */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserList />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* YANLIŞ ADRES → Ana sayfaya yönlendir */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
