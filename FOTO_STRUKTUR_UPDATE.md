# Update Fitur Foto Struktur Organisasi

## Perubahan yang Dilakukan

### 1. Foto Menjadi Opsional
- **Sebelum**: Foto wajib diisi saat menambah/edit struktur organisasi
- **Sesudah**: Foto menjadi opsional, bisa ditambahkan atau tidak

### 2. Fitur Hapus Foto
- **Tambah Struktur**: Bisa menghapus foto yang sudah dipilih sebelum disimpan
- **Edit Struktur**: Bisa menghapus foto yang sudah ada atau foto baru yang dipilih

### 3. Tampilan Default Tanpa Foto
- **Card Struktur**: Menampilkan ikon user default ketika tidak ada foto
- **Halaman Profil**: Menampilkan ikon user default untuk single person dan list
- **Admin Panel**: Menampilkan ikon user default di tabel struktur

## File yang Diubah

### 1. `pages/admin/struktur/tambah.js`
- Menghapus validasi `required` pada input foto
- Menambahkan fungsi `handleRemoveImage()` untuk menghapus foto yang dipilih
- Mengubah logika submit untuk menangani kasus tanpa foto
- Menambahkan label "(Opsional)" pada field foto

### 2. `pages/admin/struktur/edit.js`
- Menambahkan import `deleteObject` dari Firebase Storage
- Menambahkan state `fotoPath` dan `removeCurrentPhoto`
- Menambahkan fungsi `handleRemoveCurrentPhoto()` dan `handleRemoveNewPhoto()`
- Mengubah logika update untuk menghapus foto lama dari storage
- Menambahkan tombol hapus foto saat ini dan foto baru

### 3. `components/CardStruktur.js`
- Mengubah logika tampilan foto untuk menangani kasus tanpa foto
- Menambahkan fallback ikon user ketika tidak ada foto
- Menambahkan error handling untuk foto yang tidak bisa dimuat

### 4. `pages/profil/index.js`
- Mengubah tampilan foto untuk single person dan list
- Menambahkan fallback ikon user ketika tidak ada foto
- Menambahkan error handling untuk foto yang tidak bisa dimuat

### 5. `pages/admin/struktur/index.js`
- Mengubah tampilan foto di tabel admin
- Menambahkan fallback ikon user ketika tidak ada foto
- Menambahkan error handling untuk foto yang tidak bisa dimuat

### 6. `public/images/default-profile.svg`
- Menambahkan file SVG default profile image

## Fitur Baru

### 1. Hapus Foto Saat Menambah
- Klik tombol X pada preview foto untuk menghapus
- File input akan di-reset

### 2. Hapus Foto Saat Edit
- **Foto Saat Ini**: Klik tombol X untuk menghapus foto yang sudah ada
- **Foto Baru**: Klik tombol X untuk menghapus foto yang baru dipilih
- Foto lama akan dihapus dari Firebase Storage

### 3. Tampilan Default
- Ikon user abu-abu ditampilkan ketika tidak ada foto
- Konsisten di semua halaman (beranda, profil, admin)

## Cara Penggunaan

### Menambah Struktur Tanpa Foto
1. Buka halaman "Tambah Struktur"
2. Isi nama, jabatan, dan masa jabatan
3. Biarkan field foto kosong
4. Klik "Simpan Struktur"

### Menambah Struktur dengan Foto
1. Buka halaman "Tambah Struktur"
2. Isi semua field yang diperlukan
3. Upload foto (opsional)
4. Jika ingin menghapus foto, klik tombol X pada preview
5. Klik "Simpan Struktur"

### Edit Struktur - Hapus Foto
1. Buka halaman "Edit Struktur"
2. Klik tombol X pada foto saat ini untuk menghapus
3. Klik "Simpan Perubahan"

### Edit Struktur - Ganti Foto
1. Buka halaman "Edit Struktur"
2. Upload foto baru
3. Foto lama akan otomatis dihapus dari storage
4. Klik "Simpan Perubahan"

## Keuntungan

1. **Fleksibilitas**: Admin bisa menambah struktur tanpa harus memiliki foto
2. **Penghematan Storage**: Foto yang tidak diperlukan bisa dihapus
3. **UX yang Lebih Baik**: Tampilan konsisten dengan ikon default
4. **Error Handling**: Menangani kasus foto yang rusak atau tidak bisa dimuat 