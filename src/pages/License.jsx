import { useState } from 'react';

export default function License() {
  const [password, setPassword] = useState('');

  const activate = async () => {
    const result = await window.electronAPI.activateLicense(password);

    if (result.success) {
      alert('Aktivasyon başarılı');

      window.location.href = '/';
    } else {
      alert(result.error);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0f172a',
      }}
    >
      <div
        style={{
          width: 400,
          background: '#1e293b',
          padding: 30,
          borderRadius: 12,
        }}
      >
        <h1
          style={{
            color: 'white',
            marginBottom: 20,
          }}
        >
          Lisans Aktivasyonu
        </h1>

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: 12,
            marginBottom: 20,
          }}
        />

        <button
          onClick={activate}
          style={{
            width: '100%',
            padding: 12,
          }}
        >
          Aktive Et
        </button>
      </div>
    </div>
  );
}
