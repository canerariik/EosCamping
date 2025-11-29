// src/pages/Dashboard.jsx
import { useAuthStore } from '../store/authStore';
import { Tent, Calendar, Users, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Hoş geldin, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-slate-400">Bugün kampın durumu harika görünüyor</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Tent, label: 'Doluluk', value: '%88', color: 'emerald' },
          { icon: Calendar, label: 'Rezervasyon', value: '156', color: 'blue' },
          { icon: Users, label: 'Misafir', value: '89', color: 'purple' },
          {
            icon: TrendingUp,
            label: 'Gelir',
            value: '₺98.000',
            color: 'yellow',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/20 border border-${stat.color}-500/30 rounded-2xl p-6 backdrop-blur-xl`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400">{stat.label}</p>
                <p className="text-4xl font-bold mt-2">{stat.value}</p>
              </div>
              <stat.icon className={`w-12 h-12 text-${stat.color}-400`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-800 text-center">
        <h2 className="text-2xl font-bold mb-4">Sisteme Hoş Geldin!</h2>
        <p className="text-slate-400">
          Rezervasyon sistemi aktif. Sol menüden devam edebilirsin.
        </p>
      </div>
    </div>
  );
}
