// pages/admin/berita/edit.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, generateUniqueSlug } from '../../../lib/firebase'
import { uploadImage } from '../../../lib/uploadCloudinary'
import AdminLayout from '../../../components/AdminLayout'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'
import Image from 'next/image'

export default function EditBerita() {
  const router = useRouter()
  const { id } = router.query

  const [judul, setJudul] = useState('')
  const [isi, setIsi] = useState('')
  const [sumber, setSumber] = useState('')
  const [gambarLama, setGambarLama] = useState('')
  const [gambarBaru, setGambarBaru] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const docRef = doc(db, 'berita', id)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const data = docSnap.data()
            setJudul(data.judul || '')
            setIsi(data.isi || '')
            setSumber(data.sumber || '')
            setGambarLama(data.gambar || '')
          } else {
            alert('Berita tidak ditemukan')
            router.push('/admin/berita')
          }
        } catch (error) {
          console.error('Error fetching berita:', error)
          alert('Gagal mengambil data berita')
          router.push('/admin/berita')
        } finally {
          setFetching(false)
        }
      }
      fetchData()
    }
  }, [id, router])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setGambarBaru(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreviewUrl(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = gambarLama
      if (gambarBaru) {
        const imageData = await uploadImage(gambarBaru, 'berita')
        imageUrl = imageData.url
      }

      // Generate new slug if title changed
      const slug = await generateUniqueSlug(judul, id)

      const docRef = doc(db, 'berita', id)
      await updateDoc(docRef, {
        judul,
        isi,
        sumber,
        slug,
        gambar: imageUrl,
        updatedAt: new Date(),
      })

      alert('Berita berhasil diperbarui!')
      router.push('/admin/berita')
    } catch (err) {
      console.error('Error update berita:', err)
      alert('Gagal memperbarui berita')
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
                <h1 className="text-2xl font-bold text-green-700">Edit Berita</h1>
                <p className="text-gray-600 mt-1">Perbarui informasi berita yang sudah ada</p>
              </div>
              <Link 
                href="/admin/berita" 
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
                {/* Judul */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Berita <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan judul berita"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                {/* Isi Berita */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Isi Berita <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Tulis isi berita lengkap..."
                    value={isi}
                    onChange={(e) => setIsi(e.target.value)}
                    rows={8}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 resize-vertical"
                    required
                  />
                </div>

                {/* Sumber */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sumber Berita <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Humas Desa Baula"
                    value={sumber}
                    onChange={(e) => setSumber(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                {/* Upload Gambar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Berita
                  </label>
                  
                  {/* Current Image */}
                  {gambarLama && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Gambar Saat Ini:</p>
                      <div className="relative inline-block">
                        <Image 
                          width={400}
                          height={192}
                          src={gambarLama} 
                          alt="Gambar saat ini" 
                          className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200" 
                        />
                      </div>
                    </div>
                  )}

                  {/* Upload New Image */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Klik untuk upload</span> gambar baru
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
                        <p className="text-sm text-gray-600 mb-2">Preview Gambar Baru:</p>
                        <Image 
                          width={400}
                          height={192}
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200" 
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setGambarBaru(null)
                            setPreviewUrl('')
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors duration-200"
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
                    href="/admin/berita" 
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
