import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';

function Home() {
  const [asetData, setAsetData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:9000/coba/lihat');
      const data = response.data.data || [];
      setAsetData(data);
      setFilteredData(data);

      if (data.length === 0) {
        toast.info('Tidak ada data tugas. Anda dapat menambahkannya.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data tugas. Pastikan server berjalan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteAset = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await axios.delete(`http://localhost:9000/coba/hapus/${id}`);
        toast.success('Data berhasil dihapus.');
        loadData();
      } catch (error) {
        console.error('Error deleting data:', error);
        toast.error('Gagal menghapus data.');
      }
    }
  };

  const handleLogout = () => {
    toast.info('Anda telah keluar.');
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = asetData.filter((item) =>
      item.tugas.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <FaHome className="home-icon" title="Home" />
        <Link to="/tambah">
          <button className="btn btn-tambah">Tambah Data</button>
        </Link>
        <button onClick={handleLogout} className="btn btn-logout">Keluar</button>
      </div>

      <div className="content">
        <h2>Data Tugas</h2>

        <input
          type="text"
          placeholder="Cari Tugas..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />

        {loading ? (
          <p className="loading-text">Sedang memuat data...</p>
        ) : filteredData.length === 0 ? (
          <p className="no-data">Tidak ada data untuk ditampilkan.</p>
        ) : (
          <table className="styled-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>No</th>
                <th style={{ textAlign: 'center' }}>Tugas</th>
                <th style={{ textAlign: 'center' }}>Tanggal</th>
                <th style={{ textAlign: 'center' }}>Batas Waktu</th>
                <th style={{ textAlign: 'center' }}>Keterangan</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.tugas}</td>
                  <td>{item.tanggal}</td>
                  <td>{item.batas_waktu}</td>
                  <td>{item.keterangan}</td>
                  <td>
                    <Link to={`/update/${item.id}`}>
                      <button className="btn btn-edit">Edit</button>
                    </Link>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteAset(item.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Home;
