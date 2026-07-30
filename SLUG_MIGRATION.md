# Migrasi URL Berita ke Slug

## Overview
Sistem berita telah diubah dari menggunakan ID random menjadi slug yang SEO-friendly berdasarkan judul berita.

## Perubahan yang Dilakukan

### 1. Fungsi Slug Generation
- Ditambahkan fungsi `generateSlug()` di `lib/firebase.js`
- Fungsi `generateUniqueSlug()` untuk memastikan slug unik
- Fungsi `checkSlugExists()` untuk validasi slug

### 2. Halaman Admin
- **Tambah Berita** (`pages/admin/berita/tambah.js`): Otomatis generate slug dari judul
- **Edit Berita** (`pages/admin/berita/edit.js`): Update slug jika judul berubah

### 3. Halaman Publik
- **Detail Berita** (`pages/berita/[id].js`): Query berdasarkan slug bukan ID
- **Daftar Berita** (`pages/berita/index.js`): Mengirim slug ke CardBerita
- **CardBerita** (`components/CardBerita.js`): Link menggunakan slug

### 4. Script Migrasi
- `scripts/updateBeritaSlugs.js`: Script untuk mengupdate berita yang sudah ada
- `scripts/firebase-config.js`: Konfigurasi Firebase untuk script

## Cara Menjalankan Migrasi

### 1. Update Konfigurasi Firebase
Edit file `scripts/firebase-config.js` dan masukkan konfigurasi Firebase Anda:

```javascript
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
}
```

### 2. Jalankan Script Migrasi
```bash
node scripts/updateBeritaSlugs.js
```

Script akan:
- Mengambil semua berita dari database
- Generate slug untuk berita yang belum memiliki slug
- Update database dengan slug baru
- Menampilkan progress di console

### 3. Verifikasi Hasil
Setelah script selesai, cek di Firebase Console bahwa semua berita memiliki field `slug`.

## Format URL Baru

**Sebelum:**
```
/berita/abc123def456
```

**Sesudah:**
```
/berita/pengumuman-kegiatan-kelurahan-balleangin
```

## Keuntungan

1. **SEO-Friendly**: URL yang mudah dibaca dan dipahami
2. **User-Friendly**: URL yang deskriptif
3. **Shareable**: URL yang mudah dibagikan
4. **Maintainable**: Mudah diingat dan dikelola

## Catatan Penting

- Berita yang sudah ada akan tetap bisa diakses dengan ID lama sebagai fallback
- Slug akan otomatis di-generate untuk berita baru
- Jika judul berita diubah, slug akan di-update otomatis
- Duplikasi slug akan ditangani dengan menambahkan angka di akhir

## Troubleshooting

### Jika script gagal:
1. Pastikan konfigurasi Firebase benar
2. Cek koneksi internet
3. Pastikan ada izin write ke Firestore
4. Cek console untuk error detail

### Jika URL tidak berfungsi:
1. Pastikan migrasi sudah dijalankan
2. Cek apakah field `slug` sudah ada di database
3. Restart development server
4. Clear cache browser 