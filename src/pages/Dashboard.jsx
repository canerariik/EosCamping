import { useAuthStore } from '../store/authStore';
import { useReservationStore } from '../store/reservationStore';
import { useSettingStore } from '../store/settingStore';
import { Tent, Calendar, Users, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { reservations } = useReservationStore();
  const { settings } = useSettingStore();

  const todayStr = new Date().toISOString().split('T')[0];

  const activeReservations = reservations.filter((r) => {
    const giris = r.girisTarihi;
    const cikis = r.cikisTarihi;

    return (
      r.gunuBirlikMi !== true &&
      todayStr >= giris &&
      todayStr <= cikis
    );
  });

  const totalTentCount = activeReservations.reduce(
    (sum, r) => sum + Number(r.cadirSayisi || 0),
    0
  );

  const getSetting = (key) => {
    return Number(
      settings.find((s) => s.ozellik === key)?.deger || 0
    );
  };

  const maxTentCapacity = getSetting("cadir_Sayisi");

  const occupancyRate =
    maxTentCapacity > 0
      ? Math.round(
          (totalTentCount / maxTentCapacity) * 100
        )
      : 0;

  const totalGuests = activeReservations.reduce(
    (sum, r) =>
      sum +
      Number(r.yetiskinSayisi || 0) +
      Number(r.cocukSayisi || 0),
    0
  );

  const activeDailyReservations = reservations.filter(
    (r) => {
      return (
        r.gunuBirlikMi === true &&
        r.girisTarihi === todayStr
      );
    }
  );

  const totalDailyGuests =
    activeDailyReservations.reduce(
      (sum, r) =>
        sum +
        Number(r.yetiskinSayisi || 0) +
        Number(r.cocukSayisi || 0),
      0
    );

  return (
    <div className="space-y-8">
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-800 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          Hoşgeldin {user?.isim?.split(" ")[0]?.toUpperCase()}!
        </h1>

        <p className="text-slate-400">
          Rezervasyon sistemi aktif. Sol menüden devam edebilirsin.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Kamp Rezervasyon</h2>

          <p className="text-slate-400">Aktif konaklayan misafir bilgileri</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Tent,
              label: "Doluluk",
              value: `%${occupancyRate}`,
              color: "emerald",
            },
            {
              icon: Calendar,
              label: "Rezervasyon",
              value: activeReservations.length,
              color: "blue",
            },
            {
              icon: Users,
              label: "Misafir",
              value: totalGuests,
              color: "purple",
            },
            {
              icon: TrendingUp,
              label: "Aktif Çadır",
              value: totalTentCount,
              color: "yellow",
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
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Günü Birlik</h2>

          <p className="text-slate-400">Günlük giriş yapan misafir bilgileri</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Calendar,
              label: "Rezervasyon",
              value: activeDailyReservations.length,
              color: "blue",
            },
            {
              icon: Users,
              label: "Misafir",
              value: totalDailyGuests,
              color: "purple",
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
      </div>
    </div>
  );
}