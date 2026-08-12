// pages/admin/galeri/index.js
import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import { deleteImage, deleteFile } from '../../../lib/uploadCloudinary'
import { deleteFileFromStorage } from '../../../lib/uploadStorage'
import AdminLayout from '../../../components/AdminLayout'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'
import Image from 'next/image'

export default function GaleriIndex() {
  const [galeriList, setGaleriList] = useState([])
  const [bukuList, setBukuList] = useState([])
  const [loadingGaleri, setLoadingGaleri] = useState(true)
  const [loadingBuku, setLoadingBuku] = useState(true)

  useEffect(() => {
    const fetchGaleri = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'galeri'))
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setGaleriList(list)
      } catch (error) {
        console.error('Error fetching galeri:', error)
      } finally {
        setLoadingGaleri(false)
      }
    }

    const fetchBuku = async () => {
      try {
        const q = query(collection(db, 'buku_panduan'), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setBukuList(list)
      } catch (error) {
        console.error('Error fetching hilirasi KKN:', error)
      } finally {
        setLoadingBuku(false)
      }
    }

    fetchGaleri()
    fetchBuku()
  }, [])

  const handleDeleteGambar = async (id, path) => {
    if (confirm('Yakin ingin menghapus gambar ini?')) {
      try {
        if (path) await deleteImage(path)
        await deleteDoc(doc(db, 'galeri', id))
        setGaleriList(galeriList.filter(item => item.id !== id))
      } catch (err) {
        console.error('Gagal menghapus gambar:', err)
        alert('Gagal menghapus gambar!')
      }
    }
  }

  const handleDeleteBuku = async (id, url, path) => {
    if (confirm('Yakin ingin menghapus dokumen hilirasi ini?')) {
      try {
        // Hapus file dari storage — deteksi tipe berdasarkan URL
        if (path) {
          try {
            if (url?.includes('firebasestorage.googleapis.com')) {
              await deleteFileFromStorage(path)
            } else if (url?.includes('cloudinary.com')) {
              await deleteFile(path)
            }
            // Jika tidak dikenal, skip (hanya hapus data Firestore)
          } catch (fileErr) {
            // File mungkin sudah terhapus atau storage tidak tersedia
            // Lanjutkan hapus data Firestore
            console.warn('File deletion skipped:', fileErr.message)
          }
        }
        await deleteDoc(doc(db, 'buku_panduan', id))
        setBukuList(bukuList.filter(item => item.id !== id))
      } catch (err) {
        console.error('Gagal menghapus buku:', err)
        alert('Gagal menghapus dokumen hilirasi!')
      }
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return ''
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="p-8 space-y-10">

          {/* ===== SECTION 1: GALERI FOTO ===== */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-green-700">Kelola Galeri Foto</h1>
                <p className="text-gray-500 text-sm mt-1">{galeriList.length} foto tersedia</p>
              </div>
              <Link
                href="/admin/galeri/tambah"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah Foto
              </Link>
            </div>

            {loadingGaleri ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
              </div>
            ) : galeriList.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <svg className="w-14 h-14 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 mb-4">Belum ada foto di galeri</p>
                <Link
                  href="/admin/galeri/tambah"
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm transition-colors duration-200"
                >
                  Tambah Foto Pertama
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {galeriList.map((item) => (
                  <div key={item.id} className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 border border-gray-100">
                    <div className="relative aspect-square">
                      <Image
                        width={300}
                        height={300}
                        src={item.url}
                        alt={item.judul || 'Galeri'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => { e.target.src = '/images/default-image.jpg' }}
                      />
                      <button
                        onClick={() => handleDeleteGambar(item.id, item.path)}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                        title="Hapus"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    {(item.judul || item.deskripsi) && (
                      <div className="p-2">
                        {item.judul && <p className="text-xs font-medium text-gray-800 truncate">{item.judul}</p>}
                        {item.deskripsi && <p className="text-xs text-gray-400 truncate">{item.deskripsi}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* ===== SECTION 2: HILIRASI KKN 116 UNHAS ===== */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-red-700 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  Kelola Hilirasi KKN 116 Unhas
                </h2>
                <p className="text-gray-500 text-sm mt-1">{bukuList.length} dokumen tersedia</p>
              </div>
              <Link
                href="/admin/galeri/tambah-buku"
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah Dokumen Hilirasi
              </Link>
            </div>

            {loadingBuku ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
              </div>
            ) : bukuList.length === 0 ? (
              <div className="text-center py-12 bg-red-50 rounded-xl border border-dashed border-red-200">
                <svg className="w-14 h-14 mx-auto text-red-200 mb-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-500 mb-4">Belum ada dokumen hilirasi yang diupload</p>
                <Link
                  href="/admin/galeri/tambah-buku"
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm transition-colors duration-200"
                >
                  Upload Dokumen Pertama
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bukuList.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all duration-200">
                    {/* PDF Icon */}
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.judul}</p>
                      {item.deskripsi && (
                        <p className="text-sm text-gray-500 truncate mt-0.5">{item.deskripsi}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1">
                        {item.namaFile && (
                          <span className="text-xs text-gray-400 truncate max-w-xs">{item.namaFile}</span>
                        )}
                        {item.ukuranFile && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex-shrink-0">
                            {formatFileSize(item.ukuranFile)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={`/api/pdf-signed-url?publicId=${encodeURIComponent(item.path)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Buka
                      </a>
                      <button
                        onClick={() => handleDeleteBuku(item.id, item.url, item.path)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Hapus buku"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </AdminLayout>
    </RequireAuth>
  )
}
