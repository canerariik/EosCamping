import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import { useReservationStore } from './store/reservationStore';
import { useSettingStore } from './store/settingStore';
import License from './pages/License';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReservationList from './pages/Reservations/ReservationList';
import ReservationForm from './pages/Reservations/ReservationForm';
import DailyReservationList from './pages/DailyReservations/DailyReservationList';
import DailyReservationForm from './pages/DailyReservations/DailyReservationForm';
import AccommodationList from './pages/Accommodations/AccommodationList';
import UserList from './pages/Users/UserList';
import UserForm from './pages/Users/UserForm';
import PersonelInfoList from './pages/PersonelInfo/PersonelInfoList';
import PersonelInfoForm from './pages/PersonelInfo/PersonelInfoForm';
import FullReservationList from './pages/FullReservationList';

import Layout from './components/layout/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  const { user } = useAuthStore();
  const [hasUsers, setHasUsers] = useState(null);

  const initReservations = useReservationStore(state => state.init);
  const loadSettings = useSettingStore(state => state.load);

  useEffect(() => {
    const checkUsers = async () => {
      if (!window.electronAPI) {
        console.log('Electron API yok, web ortamında çalışıyorsun');
        setHasUsers(false);
        return;
      }

      try {
        const users = await window.electronAPI.usersList();
        setHasUsers(users.length > 0);
      } catch (err) {
        console.error('usersList hatası:', err);
        setHasUsers(false);
      }
    };

    checkUsers();
  }, []);

  useEffect(() => {
    if (!user) return;

    initReservations();
    loadSettings();
  }, [user]);

  if (hasUsers === null) {
    return (
      <div className="text-white text-2xl text-center mt-40\">
        Yükleniyor...
      </div>
    );
  }

  return (
    <HashRouter>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/license" element={<License />} />

        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />

        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />

          <Route path="/reservations" element={<ReservationList />} />
          <Route path="/reservations/new" element={<ReservationForm />} />
          <Route path="/reservations/edit/:id" element={<ReservationForm />} />

          <Route path="/dailyReservations" element={<DailyReservationList />} />
          <Route
            path="/dailyReservations/new"
            element={<DailyReservationForm />}
          />
          <Route
            path="/dailyReservations/edit/:id"
            element={<DailyReservationForm />}
          />

          <Route path="/accommodations" element={<AccommodationList />} />

          <Route path="/users" element={<UserList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/edit/:id" element={<UserForm />} />

          <Route path="/personels" element={<PersonelInfoList />} />
          <Route path="/personels/new" element={<PersonelInfoForm />} />
          <Route path="/personels/edit/:id" element={<PersonelInfoForm />} />

          <Route path="/fullReservations" element={<FullReservationList />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to={user ? '/' : '/login'} replace />}
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
