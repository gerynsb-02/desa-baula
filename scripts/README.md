# Scripts untuk Migrasi Slug Berita

## 🚀 Quick Start (Paling Mudah!)

```bash
cd scripts
npm install
npm run setup    # Setup otomatis
npm run migrate  # Jalankan migrasi
```

## 📋 Langkah Detail

### 1. Setup Otomatis
```bash
npm run setup
```
Script akan otomatis mencari file .env dan membuat firebase-config.js

### 2. Jalankan Migrasi
```bash
npm run migrate
```
Script akan mengupdate semua berita dengan slug baru

## 📁 File Penting

- `auto-setup.js` - Script setup otomatis
- `updateBeritaSlugs.js` - Script migrasi
- `firebase-config.js` - Konfigurasi Firebase (auto-generated)
- `firebase-config.example.js` - Contoh konfigurasi
- `QUICK_START.md` - Panduan cepat
- `setup-firebase.md` - Panduan detail

## 🔧 Manual Setup (Jika otomatis gagal)

1. **Cek file .env di root project**
2. **Salin dan edit firebase-config.js**
3. **Jalankan migrasi**

Lihat `setup-firebase.md` untuk panduan lengkap.

## ✅ Hasil

Setelah berhasil:
- Semua berita memiliki slug
- URL berubah dari `/berita/abc123` ke `/berita/judul-berita`
- URL lama tetap berfungsi (fallback)

## 🆘 Troubleshooting

- **File .env tidak ditemukan**: Pastikan ada di root project
- **Variabel hilang**: Cek semua NEXT_PUBLIC_FIREBASE_*
- **Script gagal**: Cek koneksi dan izin Firestore 