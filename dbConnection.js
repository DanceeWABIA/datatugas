const mysql = require('mysql');

// Buat pool untuk koneksi MySQL
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Kosong jika tidak ada password
  database: 'tugas', // Nama database
  connectionLimit: 10 // Maksimum koneksi simultan
});

// Fungsi untuk menguji koneksi
db.getConnection((err, connection) => {
  if (err) {
    console.error('Koneksi ke database gagal:', err.message);
  } else {
    console.log('Koneksi ke database berhasil!');
    connection.release(); // Kembalikan koneksi ke pool
  }
});

module.exports = { db };
