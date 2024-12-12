import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Indikator loading
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Email dan password wajib diisi!');
      return;
    }

    try {
      setLoading(true); // Tampilkan loading
      const response = await axios.post('http://localhost:9000/coba/login', {
        user_email: email,
        password,
      });

      if (response.status === 200) {
        toast.success('Login berhasil!');
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Simpan data pengguna di localStorage
        navigate('/home'); // Arahkan ke halaman utama (Home)
      }
    } catch (error) {
      if (error.response) {
        const { message, redirectToRegister } = error.response.data;

        if (redirectToRegister) {
          // Jika pengguna belum terdaftar, arahkan ke halaman registrasi
          toast.info('Anda belum memiliki akun. Silakan daftar terlebih dahulu.');
          navigate('/register');
        } else {
          toast.error(message || 'Login gagal!');
        }
      } else {
        toast.error('Kesalahan jaringan. Coba lagi.');
      }
    } finally {
      setLoading(false); // Sembunyikan loading
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sedang masuk...' : 'Login'}
        </button>
        <p>
          Belum punya akun? <a href="/register">Daftar di sini</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
