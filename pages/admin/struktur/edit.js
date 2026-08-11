import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import { uploadImage, deleteImage } from '../../../lib/uploadCloudinary'
import RequireAuth from '../../../components/RequireAuth'
import AdminLayout from '../../../components/AdminLayout'
import Link from 'next/link'
import Image from 'next/image'

export default function EditStruktur() {
  const router = useRouter()
  const { id } = router.query

  const [nama, setNama] = useState('')
  const [jabatan, setJabatan] = useState('')
  const [masaJabatan, setMasaJabatan] = useState('')
  const [foto, setFoto] = useState('')
  const [fotoPath, setFotoPath] = useState('')
  const [fotoFile, setFotoFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [removeCurrentPhoto, setRemoveCurrentPhoto] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const docRef = doc(db, 'struktur', id)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const data = docSnap.data()
            setNama(data.nama || '')
            setJabatan(data.jabatan || '')
            setMasaJabatan(data.masaJabatan || '')
            setFoto(data.foto || '')
            setFotoPath(data.path || '')
          } else {
            alert('Data tidak ditemukan')
            router.push('/admin/struktur')
          }
        } catch (error) {
          console.error('Error fetching struktur:', error)
          alert('Gagal mengambil data struktur')
          router.push('/admin/struktur')
        } finally {
          setFetching(false)
        }
      }
    }
    fetchData()
  }, [id, router])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFotoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreviewUrl(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveCurrentPhoto = () => {
    setRemoveCurrentPhoto(true)
    setFoto('')
    setFotoPath('')
  }

  const handleRemoveNewPhoto = () => {
    setFotoFile(null)
    setPreviewUrl('')
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let fotoUrl = foto
      let newFotoPath = fotoPath

      // If user wants to remove current photo
      if (removeCurrentPhoto && fotoPath) {
        await deleteImage(fotoPath)
        fotoUrl = ''
        newFotoPath = ''
      }

      // If user uploaded new photo
      if (fotoFile) {
        // Delete old photo if exists
        if (fotoPath && !removeCurrentPhoto) {
          await deleteImage(fotoPath)
        }
        
        const imageData = await uploadImage(fotoFile, 'struktur')
        fotoUrl = imageData.url
        newFotoPath = imageData.path
      }

      await updateDoc(doc(db, 'struktur', id), {
        nama,
        jabatan,
        masaJabatan,
        foto: fotoUrl,
        path: newFotoPath,
        updatedAt: new Date()
      })

      alert('Struktur berhasil diperbarui!')
      router.push('/admin/struktur')
    } catch (err) {
      console.error(err)
      alert('Gagal memperbarui struktur')
    }

    setLoading(false)
  }

  if (fetching) {
    return (
      <RequireAuth>
        <AdminLayout>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </AdminLayout>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-green-700">Edit Struktur Organisasi</h1>
                <p className="text-gray-600 mt-1">Perbarui informasi anggota struktur organisasi</p>
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
              <form onSubmit={handleUpdate} className="space-y-6">
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                  />
                </div>

                {/* Upload Foto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto <span className="text-gray-500 text-xs">(Opsional)</span>
                  </label>
                  
                  {/* Current Image */}
                  {foto && !removeCurrentPhoto && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Foto Saat Ini:</p>
                      <div className="relative inline-block">
                        <Image 
                          src={foto} 
                          alt="Foto saat ini" 
                          width={400}
                          height={192}
                          className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200" 
                        />
                        <button
                          type="button"
                          onClick={handleRemoveCurrentPhoto}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors duration-200"
                          title="Hapus foto saat ini"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Upload New Image */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Klik untuk upload</span> foto baru
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
                    
                    {/* Preview New Image */}
                    {previewUrl && (
                      <div className="relative">
                        <p className="text-sm text-gray-600 mb-2">Preview Foto Baru:</p>
                        <Image 
                          src={previewUrl} 
                          alt="Preview" 
                          width={400}
                          height={192}
                          className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200" 
                        />
                        <button
                          type="button"
                          onClick={handleRemoveNewPhoto}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors duration-200"
                          title="Hapus foto baru"
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
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        Simpan Perubahan
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
