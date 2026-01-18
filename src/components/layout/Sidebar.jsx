import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  Home,
  Calendar,
  Users,
  Tent,
  UserCog,
  BarChart3,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/reservations', icon: Calendar, label: 'Rezervasyonlar' },
  // { to: '/customers', icon: Users, label: 'Müşteriler' },
  { to: '/accommodations', icon: Tent, label: 'Konaklama Birimleri' },
  { to: '/users', icon: UserCog, label: 'Personel' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-72 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 flex flex-col">
      <div className="p-6">
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 rounded-2xl p-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold">
            {user?.isim?.charAt(0) || ''}
          </div>
          <h3 className="font-bold text-lg">{user?.isim || ''}</h3>
          <p className="text-emerald-400 capitalize text-sm">
            {user?.role || ''}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4">
        {menuItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-4 rounded-xl mb-2 transition-all ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'text-slate-400 hover:bg-slate-800/50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}
