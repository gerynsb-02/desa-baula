import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { useRouter } from 'next/router'
import RequireAuth from '../../../components/RequireAuth'
import AdminLayout from '../../../components/AdminLayout'
import { db } from '../../../lib/firebase'
import { uploadImage } from '../../../lib/uploadImage'
import Link from 'next/link'
import Image from 'next/image'

export default function TambahStrukturPage() {
  const router = useRouter()
  const [nama, setNama] = useState('')
  const [jabatan, setJabatan] = useState('')
  const [masaJabatan, setMasaJabatan] = useState('')
  const [foto, setFoto] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFoto(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreviewUrl(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setFoto(null)
    setPreviewUrl('')
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let fotoUrl = ''
      let fotoPath = ''
      
      if (foto) {
        const imageData = await uploadImage(foto, 'struktur')
        fotoUrl = imageData.url
        fotoPath = imageData.path
      }

      await addDoc(collection(db, 'struktur'), {
        nama,
        jabatan,
        masaJabatan,
        foto: fotoUrl,
        path: fotoPath,
        createdAt: new Date()
      })
      alert('Struktur berhasil ditambahkan!')
      router.push('/admin/struktur')
    } catch (error) {
      console.error('Gagal menambah struktur:', error)
      alert('Terjadi kesalahan saat menyimpan data.')
    }

    setLoading(false)
  }

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-green-700">Tambah Struktur Organisasi</h1>
                <p className="text-gray-600 mt-1">Tambahkan anggota baru ke struktur organisasi kelurahan</p>
              </div>
              <Link 
                href="/admin/struktur" 
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </Link>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nama */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                {/* Jabatan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jabatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Lurah, Sekretaris Lurah, dll"
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                {/* Masa Jabatan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Masa Jabatan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 2021-2024"
                    value={masaJabatan}
                    onChange={(e) => setMasaJabatan(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  />
                </div>

                {/* Upload Foto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto <span className="text-gray-500 text-xs">(Opsional)</span>
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Klik untuk upload</span> foto
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 10MB)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    {/* Preview Image */}
                    {previewUrl && (
                      <div className="relative">
                        <p className="text-sm text-gray-600 mb-2">Preview Foto:</p>
                        <Image 
                          src={previewUrl} 
                          alt="Preview" 
                          width={400}
                          height={192}
                          className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200" 
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors duration-200"
                          title="Hapus foto"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Link 
                    href="/admin/struktur" 
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Simpan Struktur
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
