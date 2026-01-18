export default function AccommodationList() {
  const units = [
    {
      id: 1,
      name: 'Çadır Alanı A1',
      type: 'Çadır',
      capacity: 4,
      price: 400,
      status: 'Dolu',
    },
    {
      id: 2,
      name: 'Bungalov 1',
      type: 'Bungalov',
      capacity: 2,
      price: 1200,
      status: 'Boş',
    },
    {
      id: 3,
      name: 'Lüks Çadır',
      type: 'Lüks Çadır',
      capacity: 6,
      price: 1800,
      status: 'Dolu',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white">Konaklama Birimleri</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map(unit => (
          <div
            key={unit.id}
            className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 p-6"
          >
            <h3 className="text-2xl font-bold text-white mb-3">{unit.name}</h3>
            <div className="space-y-2 text-slate-400">
              <p>
                Tür: <span className="text-white">{unit.type}</span>
              </p>
              <p>
                Kapasite:{' '}
                <span className="text-white">{unit.capacity} kişi</span>
              </p>
              <p>
                Gecelik:{' '}
                <span className="text-emerald-400 font-bold">
                  ₺{unit.price}
                </span>
              </p>
              <p>
                Durum:{' '}
                <span
                  className={`font-medium ${
                    unit.status === 'Dolu' ? 'text-red-400' : 'text-green-400'
                  }`}
                >
                  {unit.status}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
