# 🚀 Migrasi URL Berita ke Slug

## Apa yang Berubah?
URL berita sekarang menggunakan slug yang SEO-friendly berdasarkan judul, bukan ID random.

**Contoh:**
- ❌ Sebelum: `/berita/abc123def456`
- ✅ Sesudah: `/berita/pengumuman-kegiatan-kelurahan-balleangin`

## 🎯 Langkah Migrasi (Paling Mudah!)

### 1. Setup Otomatis
```bash
cd scripts
npm install
npm run setup
```

### 2. Jalankan Migrasi
```bash
npm run migrate
```

### 3. Selesai! 🎉
Semua berita sekarang menggunakan URL yang SEO-friendly.

---

## 🤔 Mengapa firebase-config.js?

**firebase-config.js** adalah file konfigurasi Firebase untuk script migrasi. Script ini perlu mengakses database Anda untuk mengupdate berita dengan slug baru.

### Mengapa file terpisah?
- Script migrasi berjalan di luar aplikasi Next.js
- Tidak bisa mengakses konfigurasi dari aplikasi utama
- Perlu file konfigurasi standalone

### Mengapa .env di-disable?
- **Keamanan**: Konfigurasi Firebase tidak tersimpan di Git
- **Privasi**: Setiap developer bisa punya konfigurasi berbeda
- **Best Practice**: Konfigurasi sensitif tidak di-commit

---

## 🔧 Jika Setup Otomatis Gagal

### Manual Setup:
1. **Cek file .env** di root project (bukan di scripts!)
2. **Salin konfigurasi** ke `scripts/firebase-config.js`
3. **Jalankan migrasi**

Lihat `scripts/setup-firebase.md` untuk panduan detail.

---

## ✅ Fitur Baru
- ✅ URL otomatis dari judul berita
- ✅ Fallback ke ID lama untuk kompatibilitas
- ✅ Slug unik otomatis
- ✅ Update slug saat judul berubah

## 🆘 Troubleshooting
Jika ada masalah, cek file:
- `scripts/QUICK_START.md` - Panduan cepat
- `scripts/setup-firebase.md` - Panduan detail
- `SLUG_MIGRATION.md` - Dokumentasi lengkap 