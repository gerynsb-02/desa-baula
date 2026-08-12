// lib/uploadStorage.js
// Upload file ke Firebase Storage (untuk PDF/dokumen)
// Firebase Storage tidak punya masalah CORS dan URL-nya langsung publik

import { storage } from './firebase'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'

/**
 * Upload PDF / file dokumen ke Firebase Storage
 * @param {File} file - File yang akan diupload
 * @param {string} folder - Folder di Storage (contoh: 'buku-panduan')
 * @param {function} onProgress - Callback progress (0-100), opsional
 * @returns {{ url: string, path: string }}
 */
export async function uploadFileToStorage(file, folder = 'buku-panduan', onProgress = null) {
  if (!file) throw new Error('File tidak ditemukan')

  // Buat path unik: folder/timestamp-namafile
  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `${folder}/${timestamp}-${safeName}`

  const storageRef = ref(storage, filePath)

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type || 'application/pdf',
    })

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          onProgress(progress)
        }
      },
      (error) => {
        console.error('Storage upload error:', error)
        reject(new Error(`Gagal mengupload file: ${error.message}`))
      },
      async () => {
        // Upload selesai — ambil URL publik
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        resolve({
          url,         // URL langsung bisa dibuka di browser
          path: filePath, // Path di Storage untuk keperluan hapus
        })
      }
    )
  })
}

/**
 * Hapus file dari Firebase Storage
 * @param {string} filePath - Path file di Storage
 */
export async function deleteFileFromStorage(filePath) {
  if (!filePath) return
  try {
    const fileRef = ref(storage, filePath)
    await deleteObject(fileRef)
  } catch (error) {
    // File mungkin sudah tidak ada
    if (error.code !== 'storage/object-not-found') {
      console.warn('Gagal menghapus file dari Storage:', error.message)
    }
  }
}
