import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';

function Register() {
  const [user_name, setName] = useState('');
  const [user_email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Indikator loading
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validasi input
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Pola validasi email
    if (!user_name.trim()) {
      toast.error('Nama pengguna tidak boleh kosong!');
      return;
    }
    if (!user_email.trim() || !emailRegex.test(user_email)) {
      toast.error('Masukkan email yang valid!');
      return;
    }
    if (password.length < 6) {
      toast.error('Password harus minimal 6 karakter!');
      return;
    }

    try {
      setLoading(true); // Tampilkan indikator loading

      // Mengirim data ke backend
      const response = await axios.post('http://localhost:9000/coba/register', {
        user_name,
        user_email,
        password,
      });

      if (response.status === 201 && response.data.message === 'Pendaftaran berhasil') {
        toast.success('Pendaftaran berhasil! Anda akan diarahkan ke halaman beranda.');
        
        // Simpan token atau data pengguna ke localStorage/sessionStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token); // Simpan token ke localStorage
        }

        // Navigasi ke halaman home
        navigate('/home');
      } else {
        toast.error(response.data.message || 'Pendaftaran gagal!');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message); // Pesan error dari server
      } else {
        toast.error('Terjadi kesalahan jaringan. Coba lagi.');
      }
    } finally {
      setLoading(false); // Sembunyikan indikator loading
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister}>
        <h2>Daftar Pengguna Baru</h2>
        <input
          type="text"
          placeholder="Nama Pengguna"
          value={user_name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={user_email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Mendaftar...' : 'Daftar'}
        </button>
        <p>
          Sudah punya akun? <a href="/login">Login di sini</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
