import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [isim, setIsim] = useState('');
  const [soyisim, setSoyisim] = useState('');
  const [kullaniciAdi, setKullaniciAdi] = useState('');
  const [sifre, setSifre] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!role) {
      alert('Lütfen bir rol seçiniz!');
      return;
    }
    setLoading(true);
    try {
      const result = await window.electronAPI.usersRegister({
        isim,
        soyisim,
        kullaniciAdi,
        sifre,
        role,
      });

      if (result.error) {
        alert(result.error);
      } else {
        alert('Kullanıcı başarıyla oluşturuldu!');
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      alert('Bir hata oluştu. Tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-5xl font-bold text-white mb-6 text-center">
          Yeni Kullanıcı
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="İsim"
            value={isim}
            onChange={e => setIsim(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-4 focus:ring-white/50"
            required
          />
          <input
            type="text"
            placeholder="Soyisim"
            value={soyisim}
            onChange={e => setSoyisim(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-4 focus:ring-white/50"
          />
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={kullaniciAdi}
            onChange={e => setKullaniciAdi(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-4 focus:ring-white/50"
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={sifre}
            onChange={e => setSifre(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-4 focus:ring-white/50"
            required
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            <option value="" disabled hidden>
              Lütfen seçiniz
            </option>
            <option value="admin">Admin</option>
            <option value="resepsiyon">Resepsiyon</option>
            <option value="personel">Personel</option>
          </select>

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-xl hover:scale-105 transition ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Oluşturuluyor...' : 'Kullanıcı Oluştur'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex-1 py-5 rounded-xl bg-white/20 text-white border border-white/30 flex items-center justify-center gap-2"
            >
              Geri Dön
            </button>
          </div>
        </form>
        <style>
          {`
            select option {
                background-color: rgba(255,255,255);
                color: black;
            }
          `}
        </style>
      </div>
    </div>
  );
}
