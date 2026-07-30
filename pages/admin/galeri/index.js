// pages/admin/galeri/index.js
import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { db, storage } from '../../../lib/firebase'
import AdminLayout from '../../../components/AdminLayout'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'
import Image from 'next/image'

export default function GaleriIndex() {
  const [galeriList, setGaleriList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGaleri = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'galeri'))
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setGaleriList(list)
      } catch (error) {
        console.error('Error fetching galeri:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGaleri()
  }, [])

  const handleDelete = async (id, path) => {
    if (confirm('Yakin ingin menghapus gambar ini?')) {
      try {
        if (path) {
          const imageRef = ref(storage, path)
          await deleteObject(imageRef)
        }
        await deleteDoc(doc(db, 'galeri', id))
        setGaleriList(galeriList.filter(item => item.id !== id))
      } catch (err) {
        console.error('Gagal menghapus gambar:', err)
        alert('Gagal menghapus gambar!')
      }
    }
  }

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-green-700">Kelola Galeri</h1>
            <Link 
              href="/admin/galeri/tambah" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Gambar
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : galeriList.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg mb-4">Belum ada gambar di galeri</p>
              <Link 
                href="/admin/galeri/tambah" 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Tambah Gambar Pertama
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galeriList.map((item) => (
                <div key={item.id} className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="relative">
                    <Image
                      width={400}
                      height={192}
                      src={item.url} 
                      alt={item.judul || "Galeri"} 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.target.src = '/images/default-image.jpg'
                      }}
                    />
                    
                    {/* Delete button - always visible but subtle */}
                    <button
                      onClick={() => handleDelete(item.id, item.path)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                      title="Hapus"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Image info */}
                  {(item.judul || item.deskripsi) && (
                    <div className="p-4">
                      {item.judul && (
                        <h3 className="text-sm font-medium text-gray-900 truncate">{item.judul}</h3>
                      )}
                      {item.deskripsi && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.deskripsi}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </RequireAuth>
  )
}
