import { useEffect, useState } from 'react'
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import AdminLayout from '../../../components/AdminLayout'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'
import Image from 'next/image'

export default function HeroManagement() {
  const [galeriList, setGaleriList] = useState([])
  const [heroImages, setHeroImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch galeri images
        const galeriSnapshot = await getDocs(collection(db, 'galeri'))
        const galeriData = galeriSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setGaleriList(galeriData)

        // Fetch current hero images
        const heroDoc = await getDoc(doc(db, 'settings', 'hero'))
        if (heroDoc.exists()) {
          setHeroImages(heroDoc.data().images || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const addToHero = (image) => {
    if (!heroImages.find(img => img.id === image.id)) {
      setHeroImages([...heroImages, {
        id: image.id,
        url: image.url,
        title: image.judul || 'Hero Image',
        order: heroImages.length
      }])
    }
  }

  const removeFromHero = (imageId) => {
    setHeroImages(heroImages.filter(img => img.id !== imageId))
  }

  const moveImage = (index, direction) => {
    const newImages = [...heroImages]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < newImages.length) {
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
      setHeroImages(newImages)
    }
  }

  const saveHeroImages = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, 'settings', 'hero'), {
        images: heroImages,
        updatedAt: new Date()
      })
      alert('Hero section berhasil diperbarui!')
    } catch (error) {
      console.error('Error saving hero images:', error)
      alert('Gagal menyimpan hero section')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
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
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-green-700">Kelola Hero Section</h1>
                <p className="text-gray-600 mt-1">Pilih gambar dari galeri untuk ditampilkan di hero section beranda</p>
              </div>
              <Link 
                href="/admin" 
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Hero Images */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Gambar Hero Saat Ini</h2>
                
                {heroImages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Belum ada gambar yang dipilih</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {heroImages.map((image, index) => (
                      <div key={image.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Image 
                          width={64}
                          height={64}
                          src={image.url} 
                          alt={image.title} 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{image.title}</p>
                          <p className="text-xs text-gray-500">Urutan: {index + 1}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveImage(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Pindah ke atas"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => moveImage(index, 'down')}
                            disabled={index === heroImages.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Pindah ke bawah"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => removeFromHero(image.id)}
                            className="p-1 text-red-400 hover:text-red-600"
                            title="Hapus dari hero"
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

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={saveHeroImages}
                    disabled={saving}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Simpan Hero Section
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Available Gallery Images */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Pilih dari Galeri</h2>
                
                {galeriList.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Belum ada gambar di galeri</p>
                    <Link 
                      href="/admin/galeri/tambah" 
                      className="mt-2 inline-block text-green-600 hover:text-green-700"
                    >
                      Tambah gambar ke galeri
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {galeriList.map((image) => {
                      const isInHero = heroImages.find(img => img.id === image.id)
                      return (
                        <div key={image.id} className="relative group">
                          <Image 
                            width={200}
                            height={96}
                            src={image.url} 
                            alt={image.judul || 'Galeri'} 
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          
                          {/* Overlay with actions */}
                          <div className="absolute inset-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                            {isInHero ? (
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <span className="text-white text-xs bg-green-600 px-2 py-1 rounded">Sudah Dipilih</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToHero(image)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-green-600 hover:bg-green-700 text-white p-1 rounded"
                                title="Tambah ke hero"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                            )}
                          </div>
                          
                          {image.judul && (
                            <p className="text-xs text-gray-600 mt-1 truncate">{image.judul}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Petunjuk Penggunaan:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Pilih gambar dari galeri untuk ditampilkan di hero section beranda</li>
                <li>• Urutan gambar dapat diatur dengan tombol panah atas/bawah</li>
                <li>• Gambar pertama akan ditampilkan sebagai slide pertama</li>
                <li>• Klik &quot;Simpan Hero Section&quot; untuk menerapkan perubahan</li>
              </ul>
            </div>
          </div>
        </div>
      </AdminLayout>
    </RequireAuth>
  )
} 