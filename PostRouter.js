const router = require('express').Router();
const { db } = require('../models/dbConnection');
const bcrypt = require('bcrypt');

// Route untuk melihat semua data tugas
router.get('/lihat', (req, res) => {
    const sqlQuery = "SELECT * FROM datatugas";
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Kesalahan pada database', error: err });
        } else {
            res.status(200).json({ data: result });
        }
    });
});

// Route untuk menambahkan data tugas
router.post('/buat', (req, res) => {
    const { tugas, tanggal, batas_waktu, keterangan } = req.body;
    if (!tugas || !tanggal || !batas_waktu || !keterangan) {
        return res.status(400).json({ message: 'Semua kolom wajib diisi!' });
    }

    const sqlQuery = "INSERT INTO datatugas (tugas, tanggal, batas_waktu, keterangan) VALUES (?, ?, ?, ?)";
    db.query(sqlQuery, [tugas, tanggal, batas_waktu, keterangan], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Kesalahan pada database', error: err });
        } else {
            res.status(201).json({ message: 'Data berhasil ditambahkan', data: result });
        }
    });
});

// Route untuk menghapus data tugas berdasarkan ID
router.delete('/hapus/:id', (req, res) => {
    const { id } = req.params;
    const sqlQuery = "DELETE FROM datatugas WHERE id = ?";
    db.query(sqlQuery, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Kesalahan pada database', error: err });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Data tidak ditemukan' });
        } else {
            res.status(200).json({ message: 'Data berhasil dihapus' });
        }
    });
});

// Route untuk memperbarui data tugas berdasarkan ID
router.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { tugas, tanggal, batas_waktu, keterangan } = req.body;

    if (!tugas || !tanggal || !batas_waktu || !keterangan) {
        return res.status(400).json({ message: 'Semua kolom wajib diisi!' });
    }

    const sqlQuery = "UPDATE datatugas SET tugas = ?, tanggal = ?, batas_waktu = ?, keterangan = ? WHERE id = ?";
    db.query(sqlQuery, [tugas, tanggal, batas_waktu, keterangan, id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Kesalahan pada database', error: err });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Data tidak ditemukan' });
        } else {
            res.status(200).json({ message: 'Data berhasil diperbarui' });
        }
    });
});

// Route untuk mendapatkan data berdasarkan ID
router.get('/rubah/:id', (req, res) => {
    const { id } = req.params;

    const sqlQuery = "SELECT * FROM datatugas WHERE id = ?";
    db.query(sqlQuery, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Kesalahan pada database', error: err });
        } else if (result.length === 0) {
            res.status(404).json({ message: 'Data tidak ditemukan' });
        } else {
            res.status(200).json({ data: result[0] });
        }
    });
});

// Route untuk registrasi
router.post('/register', async (req, res) => {
    const { user_name, user_email, password } = req.body;
  
    // Validasi input
    if (!user_name || !user_email || !password) {
      return res.status(400).json({ message: 'Semua kolom wajib diisi!' });
    }
    if (!/\S+@\S+\.\S+/.test(user_email)) { // Pola regex untuk validasi email
      return res.status(400).json({ message: 'Email tidak valid!' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password harus minimal 6 karakter!' });
    }
  
    try {
      // Periksa apakah email sudah terdaftar
      const checkEmailQuery = 'SELECT * FROM login WHERE user_email = ?';
      const [existingUser] = await new Promise((resolve, reject) => {
        db.query(checkEmailQuery, [user_email], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Masukkan data pengguna baru ke database
      const insertQuery = 'INSERT INTO login (user_name, user_email, password) VALUES (?, ?, ?)';
      await new Promise((resolve, reject) => {
        db.query(insertQuery, [user_name, user_email, hashedPassword], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
  
      // Respon sukses
      res.status(201).json({ message: 'Pendaftaran berhasil' });
    } catch (error) {
      console.error('Kesalahan server:', error);
      res.status(500).json({ message: 'Terjadi kesalahan pada server', error });
    }
  });


// Route untuk login
router.post('/login', (req, res) => {
    const { user_email, password } = req.body;
  
    // Validasi input
    if (!user_email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi!' });
    }
  
    const checkUserQuery = 'SELECT * FROM login WHERE user_email = ?';
    db.query(checkUserQuery, [user_email], (err, result) => {
      if (err) {
        console.error('Kesalahan saat memeriksa pengguna:', err);
        return res.status(500).json({ message: 'Kesalahan pada database', error: err });
      }
  
      if (result.length === 0) {
        // Jika email tidak ditemukan
        return res.status(404).json({
          message: 'Email tidak ditemukan! Silakan daftar terlebih dahulu.',
          redirectToRegister: true,
        });
      }
  
      const user = result[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error('Kesalahan saat memvalidasi password:', err);
          return res.status(500).json({ message: 'Kesalahan pada validasi password', error: err });
        }
        if (!isMatch) {
          return res.status(401).json({ message: 'Password salah!' });
        }
  
        // Kembalikan data pengguna tanpa password
        const { password, ...userWithoutPassword } = user;
        res.status(200).json({ message: 'Login berhasil!', user: userWithoutPassword });
      });
    });
  });

 
  
module.exports = router;
