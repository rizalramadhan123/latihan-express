# Sistem Penyewaan Perpustakaan

## Gambaran Umum

Aplikasi ini adalah sistem penyewaan perpustakaan yang dibangun menggunakan Node.js, Express.js, EJS, MongoDB, Bootstrap, dan Swagger. Sistem ini mencakup tiga koleksi: `books`, `members`, dan `sewas`. Aplikasi menyediakan API CRUD untuk mengelola buku dan anggota, serta menangani penyewaan dan pengembalian buku dengan hukuman terkait untuk pengembalian terlambat.

## Fitur

1. **Manajemen Buku dan Anggota:**
    - Operasi CRUD untuk buku dan anggota.
    - Anggota memiliki kolom `penalty` untuk menandai jika mereka terkena penalti.

2. **Manajemen Penyewaan:**
    - Penyewaan buku oleh anggota.
    - Batas maksimal penyewaan adalah dua buku per anggota.
    - Jika pengembalian buku terlambat lebih dari 7 hari, anggota akan dikenai penalti dan ini akan memperbarui kolom `penalty` pada tabel anggota.
    - Stok buku akan berkurang saat dipinjam dan bertambah saat dikembalikan.

## Instalasi dan Penggunaan

### Persyaratan
- Node.js
- Express.js
- EJS
- MongoDB
- Bootstrap
- Swagger

### Langkah Instalasi
1. Clone repository:
    ```bash
    git clone https://github.com/username/repository-name.git
    cd repository-name
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Jalankan server:
    ```bash
    npm start
    ```

### Struktur API

#### Members

- **GET /members**
    - Mendapatkan semua anggota.
- **POST /members**
    - Menambahkan anggota baru.
- **PUT /members/:id**
    - Memperbarui anggota berdasarkan ID.
- **DELETE /members/:id**
    - Menghapus anggota berdasarkan ID.

#### Books

- **GET /books**
    - Mendapatkan semua buku.
- **POST /books**
    - Menambahkan buku baru.
- **PUT /books/:id**
    - Memperbarui buku berdasarkan ID.
- **DELETE /books/:id**
    - Menghapus buku berdasarkan ID.

#### Sewa

- **GET /sewa**
    - Mendapatkan semua catatan penyewaan.
- **POST /sewa**
    - Membuat catatan penyewaan baru.
    - Membatasi anggota untuk menyewa maksimal 2 buku.
- **DELETE /sewa/:id**
    - Menghapus catatan penyewaan berdasarkan ID.
    - Memeriksa apakah pengembalian terlambat dan memberikan penalti jika lebih dari 7 hari.

### Konsep Use Case

1. **Pengembalian Buku Terlambat:**
    - Jika anggota mengembalikan buku lebih dari 7 hari setelah tanggal jatuh tempo, anggota akan dikenai penalti.
    ```javascript
    // Cek apakah pengembalian terlambat
    const currentDate = new Date();
    const endDate = new Date(sewa.endDate);
    const diffTime = Math.abs(currentDate - endDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      // Menetapkan penalti pada member
      await Member.findByIdAndUpdate(sewa.memberId, { penalty: 't' });
    }
    ```

2. **Batas Maksimal Penyewaan Buku:**
    - Jika anggota sudah menyewa dua buku, mereka tidak bisa menyewa buku lagi hingga salah satu buku dikembalikan.
    ```javascript
    const sewaCount = await Sewa.countDocuments({ memberId });
    if (sewaCount >= 2) {
      return res.status(400).json({ message: 'Member sudah menyewa 2 buku' });
    }
    ```

## Tampilan Antarmuka

Aplikasi ini memiliki tiga menu utama:
1. **Swagger UI:**
    - Untuk mengecek API yang telah dibuat.
2. **Aplikasi Penyewaan:**
    - Untuk mengecek apakah API GET berhasil atau tidak (menggunakan EJS, jQuery, Bootstrap).
3. **Tes Algoritma:**
    - Untuk menguji soal algoritma.

Berikut adalah screenshot tampilan aplikasi:

![image](https://github.com/rizalramadhan123/tes-perusahaan-express/assets/56623274/76eb19a6-e2b6-411a-b103-e73b3162a926)

## Penutup

Aplikasi ini adalah contoh implementasi sistem penyewaan perpustakaan yang mencakup fitur-fitur dasar yang diperlukan. Terima kasih atas kesempatan yang diberikan untuk mengerjakan tes ini. Jika ada pertanyaan atau masukan, jangan ragu untuk menghubungi saya.

Terima kasih.
