# 🚀 Quick Start - Migrasi Slug Berita

## Langkah 1: Setup Otomatis (Mudah!)

```bash
cd scripts
npm install
npm run setup
```

Script akan otomatis:
- ✅ Mencari file .env di project Anda
- ✅ Mengambil konfigurasi Firebase
- ✅ Membuat firebase-config.js

## Langkah 2: Jalankan Migrasi

```bash
npm run migrate
```

Selesai! 🎉

---

## Jika Setup Otomatis Gagal

### Manual Setup:

1. **Cek file .env** di root project:
   ```bash
   # Di root project (bukan di folder scripts)
   cat .env.local
   # atau
   cat .env
   ```

2. **Salin konfigurasi:**
   ```bash
   cd scripts
   cp firebase-config.example.js firebase-config.js
   ```

3. **Edit firebase-config.js** dengan nilai dari .env Anda

4. **Jalankan migrasi:**
   ```bash
   npm install
   npm run migrate
   ```

---

## Troubleshooting

**❌ "File .env tidak ditemukan"**
- Pastikan ada file `.env.local` atau `.env` di root project
- Bukan di folder scripts!

**❌ "Variabel Firebase yang hilang"**
- Cek apakah semua variabel NEXT_PUBLIC_FIREBASE_* ada di .env

**❌ "Script gagal"**
- Cek koneksi internet
- Cek apakah konfigurasi Firebase benar
- Cek izin Firestore

---

## Hasil

Setelah berhasil:
- ✅ Semua berita memiliki slug
- ✅ URL berubah dari `/berita/abc123` ke `/berita/judul-berita`
- ✅ URL lama tetap berfungsi (fallback) 