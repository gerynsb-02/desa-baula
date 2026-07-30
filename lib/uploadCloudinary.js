// lib/uploadCloudinary.js
// Upload gambar ke Cloudinary menggunakan unsigned upload preset

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

/**
 * Upload gambar ke Cloudinary
 * @param {File} file - File gambar yang akan diupload
 * @param {string} folder - Folder tujuan di Cloudinary (contoh: 'berita', 'galeri', 'struktur')
 * @returns {{ url: string, publicId: string, path: string }}
 */
export async function uploadImage(file, folder = 'desa-baula') {
  if (!file) throw new Error('File tidak ditemukan')
  if (!CLOUD_NAME) throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME belum diisi di .env.local')
  if (!UPLOAD_PRESET) throw new Error('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET belum diisi di .env.local')

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', `desa-baula/${folder}`)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Gagal mengupload gambar ke Cloudinary')
  }

  const data = await response.json()

  return {
    url: data.secure_url,      // URL gambar yang bisa langsung dipakai
    publicId: data.public_id,  // ID untuk keperluan delete nanti
    path: data.public_id,      // Alias path (kompatibel dengan kode lama)
  }
}

/**
 * Hapus gambar dari Cloudinary (memerlukan server-side / API route)
 * Gunakan publicId yang disimpan saat upload
 * @param {string} publicId
 */
export async function deleteImage(publicId) {
  if (!publicId) return
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    })
    if (!response.ok) {
      console.warn('Gagal menghapus gambar dari Cloudinary')
    }
  } catch (error) {
    console.warn('Error menghapus gambar:', error)
  }
}
