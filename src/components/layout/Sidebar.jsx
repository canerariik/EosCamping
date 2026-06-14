import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Home, Calendar, Tent, UserCog, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const isPersonel = user?.role === 'personel';
  const isReception = user?.role === 'resepsiyon';

  const menuItems = [
    {
      label: 'EOS İstatistik',
      icon: Home,
      to: '/',
    },

    {
      label: 'Randevu',
      icon: Calendar,
      children: [
        {
          to: '/reservations',
          icon: Calendar,
          label: 'Kamp Rezervasyon',
        },
        {
          to: '/dailyReservations',
          icon: Calendar,
          label: 'Günlük Rezervasyon',
        },
      ],
    },

    ...(!isPersonel && !isReception
      ? [
          {
            to: '/accommodations',
            icon: Tent,
            label: 'Konaklama Birimleri',
          },

          {
            label: 'Yönetim',
            icon: UserCog,
            children: [
              {
                to: '/users',
                icon: UserCog,
                label: 'Kullanıcı Bilgileri',
              },
              {
                to: '/personels',
                icon: UserCog,
                label: 'Personel Bilgileri',
              },
            ],
          },
        ]
      : []),
  ];

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
        {menuItems.map(item => {
          if (item.children) {
            return (
              <div key={item.label} className="mb-4">
                <div className="flex items-center gap-3 px-4 py-3 text-slate-300">
                  <item.icon className="w-5 h-5" />
                  <span className="font-semibold uppercase text-sm tracking-wide">
                    {item.label}
                  </span>
                </div>

                <div className="ml-4 border-l border-slate-700 pl-3">
                  {item.children.map(child => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                            : 'text-slate-400 hover:bg-slate-800/50'
                        }`
                      }
                    >
                      <child.icon className="w-4 h-4" />
                      <span className="font-medium">{child.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          }

          return (
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
          );
        })}
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
