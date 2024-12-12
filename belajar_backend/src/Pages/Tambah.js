import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Tambah.css';

const initialState = {
  tugas: '',
  tanggal: '',
  batas_waktu: '',
  keterangan: '',
};

function Tambah() {
  const [state, setState] = useState(initialState); // Inisialisasi state dengan default
  const { tugas, tanggal, batas_waktu, keterangan } = state; // Destrukturisasi untuk kemudahan akses
  const navigate = useNavigate();
  const { id } = useParams(); // Ambil parameter `id` dari URL

  // Fungsi untuk memuat data jika ada `id`
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:9000/coba/rubah/${id}`);
          console.log('Respons API:', response.data); // Debug respons API
          if (response.data && response.data.data) {
            setState(response.data.data); // Mengisi state dengan data dari API
          } else {
            toast.error('Data tidak ditemukan.');
            navigate('/'); // Redirect jika data tidak ditemukan
          }
        } catch (error) {
          console.error('Error fetching data:', error.message);
          toast.error('Gagal memuat data untuk diedit.');
        }
      };
      fetchData();
    }
  }, [id, navigate]);

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tugas || !tanggal || !batas_waktu || !keterangan) {
      toast.error('Harap isi semua kolom');
      return;
    }

    try {
      if (id) {
        // Jika ada `id`, lakukan update
        await axios.put(`http://localhost:9000/coba/update/${id}`, {
          tugas,
          tanggal,
          batas_waktu,
          keterangan,
        });
        toast.success('Data tugas berhasil diperbarui!');
      } else {
        // Jika tidak ada `id`, tambahkan data baru
        await axios.post('http://localhost:9000/coba/buat', {
          tugas,
          tanggal,
          batas_waktu,
          keterangan,
        });
        toast.success('Data tugas berhasil ditambahkan!');
      }
      navigate('/home'); // Kembali ke halaman Home setelah selesai
    } catch (error) {
      console.error('Error saving data:', error.message);
      toast.error('Gagal menyimpan data. Coba lagi.');
    }
  };

  // Fungsi untuk menangani perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  // Fungsi untuk kembali ke halaman Home
  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="tambah-container">
      <form className="tambah-form" onSubmit={handleSubmit}>
        <h2>{id ? 'Edit Data Tugas' : 'Tambah Data Tugas'}</h2>

        <label htmlFor="tugas">Tugas</label>
        <input
          type="text"
          id="tugas"
          name="tugas"
          value={tugas || ''}
          onChange={handleInputChange}
          placeholder="Masukkan Tugas"
          required
        />

        <label htmlFor="tanggal">Tanggal</label>
        <input
          type="date"
          id="tanggal"
          name="tanggal"
          value={tanggal || ''}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="batas_waktu">Batas Waktu</label>
        <input
          type="date"
          id="batas_waktu"
          name="batas_waktu"
          value={batas_waktu || ''}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="keterangan">Keterangan</label>
        <textarea
          id="keterangan"
          name="keterangan"
          value={keterangan || ''}
          onChange={handleInputChange}
          placeholder="Masukkan Keterangan"
          required
        ></textarea>

        <div className="form-actions">
          <button type="submit" className="btn-tambah">
            {id ? 'Perbarui' : 'Tambah'}
          </button>
          <button
            type="button"
            className="btn-kembali"
            onClick={handleBackToHome}
          >
            Kembali ke Home
          </button>
        </div>
      </form>
    </div>
  );
}

export default Tambah;
