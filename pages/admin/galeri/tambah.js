// pages/admin/galeri/tambah.js
import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { db } from '../../../lib/firebase'
import { uploadImage } from '../../../lib/uploadCloudinary'
import RequireAuth from '../../../components/RequireAuth'
import AdminLayout from '../../../components/AdminLayout'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FiArrowLeft, 
  FiUpload, 
  FiX, 
  FiCheck,
  FiImage,
  FiFileText
} from 'react-icons/fi'

export default function TambahGaleriPage() {
  const router = useRouter()
  const [gambarList, setGambarList] = useState([])
  const [judul, setJudul] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      const newImages = files.map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        preview: URL.createObjectURL(file)
      }))
      setGambarList(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (id) => {
    setGambarList(prev => {
      const filtered = prev.filter(img => img.id !== id)
      return filtered
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (gambarList.length === 0) {
      alert('Pilih minimal satu gambar!')
      return
    }
    
    setLoading(true)

    try {
      const uploadPromises = gambarList.map(async (gambarItem) => {
        console.log('Uploading image:', gambarItem.file.name)
        const imageData = await uploadImage(gambarItem.file, 'galeri')
        console.log('Upload result:', imageData)
        
        const galeriData = {
          url: imageData.url,
          path: imageData.path,
          judul: judul || '',
          deskripsi: deskripsi || '',
          tanggal: new Date(),
          createdAt: new Date()
        }
        
        return addDoc(collection(db, 'galeri'), galeriData)
      })
      
      await Promise.all(uploadPromises)
      
      alert(`${gambarList.length} gambar berhasil ditambahkan!`)
      router.push('/admin/galeri')
    } catch (error) {
      console.error('Gagal menambahkan gambar:', error)
      alert('Terjadi kesalahan saat menyimpan gambar.')
    }

    setLoading(false)
  }

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="animate-fade-in">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">Tambah Gambar Galeri</h1>
                  <p className="text-slate-600">Tambahkan beberapa gambar sekaligus ke galeri kelurahan</p>
                </div>
                <Link 
                  href="/admin/galeri" 
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors duration-200"
                >
                  <FiArrowLeft className="w-5 h-5" />
                  Kembali ke Galeri
                </Link>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload Gambar */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Gambar <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiUpload className="w-8 h-8 mb-4 text-slate-500" />
                          <p className="mb-2 text-sm text-slate-500">
                            <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                          </p>
                          <p className="text-xs text-slate-500">PNG, JPG, GIF (MAX. 10MB) - Pilih beberapa gambar sekaligus</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    {/* Preview Images */}
                    {gambarList.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-700">
                            {gambarList.length} gambar dipilih
                          </p>
                          <button
                            type="button"
                            onClick={() => setGambarList([])}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            Hapus Semua
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {gambarList.map((gambarItem) => (
                            <div key={gambarItem.id} className="relative">
                              <Image 
                                width={400}
                                height={192}
                                src={gambarItem.preview} 
                                alt="Preview" 
                                className="w-full h-48 object-cover rounded-xl border border-slate-200" 
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(gambarItem.id)}
                                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                              <div className="mt-2 text-xs text-slate-500 truncate">
                                {gambarItem.file.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Judul */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FiFileText className="w-4 h-4" />
                      Judul Gambar
                    </div>
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan judul gambar (opsional)"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-900 transition-all duration-200 placeholder:text-slate-500"
                  />
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FiImage className="w-4 h-4" />
                      Deskripsi
                    </div>
                  </label>
                  <textarea
                    placeholder="Masukkan deskripsi gambar (opsional)"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-900 resize-vertical transition-all duration-200 placeholder:text-slate-500"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
                  <Link 
                    href="/admin/galeri" 
                    className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Mengunggah {gambarList.length} gambar...
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-5 h-5" />
                        Simpan {gambarList.length > 0 ? `${gambarList.length} Gambar` : 'Gambar'}
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
