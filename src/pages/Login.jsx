// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/');
    } else {
      alert('Kullanıcı adı veya şifre yanlış!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">CampFlow</h1>
          <p className="text-white/80">Kamp Yönetim Sistemi</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Kullanıcı adı"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-4 focus:ring-white/50"
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-4 focus:ring-white/50"
            required
          />
          <button
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-xl hover:scale-105 transition"
          >
            Giriş Yap
          </button>
        </form>
        <div className="mt-6 text-center text-white/70 text-sm">
          <p>admin / 123</p>
          <p>resepsiyon / 123</p>
        </div>
      </div>
    </div>
  );
}
