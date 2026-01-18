import { useAuthStore } from '../../store/authStore';
import {
  LogOut,
  User,
  Calendar,
  Tent,
  Users,
  Home,
  BarChart3,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl">
            <Tent className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              CampFlow
            </h1>
            <p className="text-slate-400 text-sm">Kamp Yönetim Sistemi</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Çıkış
          </button>
        </div>
      </div>
    </header>
  );
}
