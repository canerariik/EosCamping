export default function UserList() {
  const users = [
    { id: 1, name: 'Ahmet Yılmaz', role: 'admin', username: 'admin' },
    { id: 2, name: 'Zeynep Kaya', role: 'resepsiyon', username: 'resepsiyon' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white">Personel</h1>

      <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left p-6">Ad Soyad</th>
              <th className="text-left p-6">Kullanıcı Adı</th>
              <th className="text-left p-6">Rol</th>
              <th className="text-left p-6">Durum</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr
                key={u.id}
                className="border-t border-slate-800 hover:bg-slate-800/30"
              >
                <td className="p-6 font-medium">{u.name}</td>
                <td className="p-6">{u.username}</td>
                <td className="p-6">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      u.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {u.role === 'admin' ? 'Yönetici' : 'Resepsiyon'}
                  </span>
                </td>
                <td className="p-6">
                  <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm">
                    Aktif
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
