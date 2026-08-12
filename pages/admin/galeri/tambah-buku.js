// pages/admin/galeri/tambah-buku.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import { uploadFile, uploadImage } from '../../../lib/uploadCloudinary'
import AdminLayout from '../../../components/AdminLayout'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'
import Image from 'next/image'

export default function TambahBukuPanduan() {
  const router = useRouter()
  const [judul, setJudul] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [file, setFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  // Handler PDF file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    if (selectedFile.type !== 'application/pdf') {
      alert('Hanya file PDF yang diizinkan!')
      e.target.value = ''
      return
    }

    const maxSize = 20 * 1024 * 1024
    if (selectedFile.size > maxSize) {
      alert('Ukuran file maksimal 20MB!')
      e.target.value = ''
      return
    }

    setFile(selectedFile)
  }

  const handleRemoveFile = () => {
    setFile(null)
    const fileInput = document.getElementById('pdf-input')
    if (fileInput) fileInput.value = ''
  }

  // Handler foto sampul
  const handleCoverChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith('image/')) {
      alert('Hanya file gambar (JPG, PNG, dll) yang diizinkan untuk foto sampul!')
      e.target.value = ''
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (selectedFile.size > maxSize) {
      alert('Ukuran foto sampul maksimal 5MB!')
      e.target.value = ''
      return
    }

    setCoverFile(selectedFile)
    const reader = new FileReader()
    reader.onload = (e) => setCoverPreview(e.target.result)
    reader.readAsDataURL(selectedFile)
  }

  const handleRemoveCover = () => {
    setCoverFile(null)
    setCoverPreview('')
    const coverInput = document.getElementById('cover-input')
    if (coverInput) coverInput.value = ''
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      alert('Silakan pilih file PDF terlebih dahulu!')
      return
    }

    setLoading(true)

    try {
      // Upload PDF ke Cloudinary
      setUploadProgress('Mengupload file PDF...')
      const fileData = await uploadFile(file, 'buku-panduan')

      // Upload foto sampul ke Cloudinary (opsional)
      let thumbnailUrl = ''
      if (coverFile) {
        setUploadProgress('Mengupload foto sampul...')
        const coverData = await uploadImage(coverFile, 'buku-panduan-cover')
        thumbnailUrl = coverData.url
      }

      // Simpan ke Firestore
      setUploadProgress('Menyimpan data...')
      await addDoc(collection(db, 'buku_panduan'), {
        judul,
        deskripsi,
        url: fileData.url,
        path: fileData.path,
        thumbnailUrl,
        namaFile: file.name,
        ukuranFile: file.size,
        createdAt: serverTimestamp(),
      })

      alert('Dokumen hilirasi berhasil ditambahkan!')
      router.push('/admin/galeri')
    } catch (err) {
      console.error('Error upload dokumen:', err)
      alert(`Gagal menambahkan dokumen hilirasi: ${err.message}`)
    } finally {
      setLoading(false)
      setUploadProgress('')
    }
  }

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="p-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-green-700">Tambah Dokumen Hilirasi KKN 116</h1>
                <p className="text-gray-600 mt-1">Upload file PDF dokumen hilirasi KKN 116 Universitas Hasanuddin</p>
              </div>
              <Link
                href="/admin/galeri"
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </Link>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Judul */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Dokumen <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Laporan Akhir KKN 116 Kelurahan Baula"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                    required
                  />
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi <span className="text-gray-400 font-normal">(opsional)</span>
                  </label>
                  <textarea
                    placeholder="Tulis deskripsi singkat tentang isi dokumen hilirasi ini..."
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 resize-vertical placeholder:text-gray-500"
                  />
                </div>

                {/* ===== FOTO SAMPUL ===== */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Sampul / Cover{' '}
                    <span className="text-gray-400 font-normal">(opsional — akan ditampilkan sebagai preview kartu)</span>
                  </label>

                  {!coverFile ? (
                    <label
                      htmlFor="cover-input"
                      className="flex flex-col items-center justify-center w-full h-36 border-2 border-green-300 border-dashed rounded-xl cursor-pointer bg-green-50 hover:bg-green-100 transition-colors duration-200"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Klik untuk upload foto sampul</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG (Maks. 5MB)</p>
                      </div>
                      <input
                        id="cover-input"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative group">
                      <div className="relative w-full h-48 rounded-xl overflow-hidden border border-green-200">
                        <Image
                          src={coverPreview}
                          alt="Preview sampul"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCover}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors duration-200 shadow-lg"
                        title="Hapus foto sampul"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">Foto sampul siap diupload</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* ===== UPLOAD PDF ===== */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File PDF <span className="text-red-500">*</span>
                  </label>

                  {!file ? (
                    <label
                      htmlFor="pdf-input"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-red-300 border-dashed rounded-xl cursor-pointer bg-red-50 hover:bg-red-100 transition-colors duration-200"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-3">
                          <svg className="w-7 h-7 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="mb-1 text-sm text-gray-600 font-medium">
                          Klik untuk memilih file PDF
                        </p>
                        <p className="text-xs text-gray-500">Hanya PDF • Maksimal 20MB</p>
                      </div>
                      <input
                        id="pdf-input"
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600 font-medium">Siap diupload</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors duration-200 flex-shrink-0"
                        title="Hapus file"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Upload Progress */}
                {loading && uploadProgress && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 flex-shrink-0"></div>
                    <p className="text-sm text-blue-700">{uploadProgress}</p>
                  </div>
                )}

                {/* Info Box */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-amber-800">Tips Foto Sampul</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Upload foto sampul atau screenshot halaman pertama PDF agar muncul sebagai preview di halaman galeri publik. Ukuran ideal: 400×566px (rasio A4).
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                  <Link
                    href="/admin/galeri"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={loading || !file}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Mengupload...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload Dokumen Hilirasi
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AdminLayout>
    </RequireAuth>
  )
}
