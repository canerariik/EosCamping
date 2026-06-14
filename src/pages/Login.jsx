import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        toast.success('Giriş başarılı.');
        navigate('/');
      } else {
        toast.error('Kullanıcı adı veya şifre yanlış!');
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      toast.error('Bir hata oluştu. Tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl p-10 w-full max-w-md border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">EOS Camp</h1>
          <p className="text-white/80">Kamp Yönetim Sistemi</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              KULLANICI ADI
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-6 py-4 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              KULLANICI ŞİFRE
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 bg-emerald-600 text-white font-bold text-lg rounded-xl ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}
