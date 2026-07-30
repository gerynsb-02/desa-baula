import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { db, storage } from '../../../lib/firebase'
import AdminLayout from '../../../components/AdminLayout'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiUsers, 
  FiUser,
  FiSearch,
  FiAward,
  FiCalendar
} from 'react-icons/fi'

export default function StrukturIndex() {
  const [strukturList, setStrukturList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchStruktur = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'struktur'))
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setStrukturList(list)
      } catch (error) {
        console.error('Error fetching struktur:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStruktur()
  }, [])

  const handleDelete = async (id, path) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      try {
        if (path) {
          const imageRef = ref(storage, path)
          await deleteObject(imageRef)
        }
        await deleteDoc(doc(db, 'struktur', id))
        setStrukturList(strukturList.filter(item => item.id !== id))
      } catch (err) {
        console.error('Gagal menghapus struktur:', err)
        alert('Gagal menghapus data!')
      }
    }
  }

  const filteredStruktur = strukturList.filter(item =>
    item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.jabatan?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="animate-fade-in">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Kelola Struktur Organisasi</h1>
                <p className="text-slate-600">Tambah, edit, atau hapus data struktur organisasi kelurahan</p>
              </div>
              <Link 
                href="/admin/struktur/tambah" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiPlus className="w-5 h-5" />
                Tambah Struktur
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                             <input
                 type="text"
                 placeholder="Cari nama atau jabatan..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900"
               />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : filteredStruktur.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {searchTerm ? 'Tidak ada hasil pencarian' : 'Belum ada data struktur'}
              </h3>
              <p className="text-slate-600 mb-6">
                {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Mulai dengan menambahkan data struktur pertama'}
              </p>
              {!searchTerm && (
                <Link 
                  href="/admin/struktur/tambah" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl transition-all duration-200"
                >
                  <FiPlus className="w-5 h-5" />
                  Tambah Struktur Pertama
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Foto</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Nama</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Jabatan</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Masa Jabatan</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredStruktur.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="w-16 h-16 rounded-lg border-2 border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden">
                            {item.foto ? (
                              <Image 
                                src={item.foto} 
                                alt={item.nama} 
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                  e.target.nextSibling.style.display = 'flex'
                                }}
                              />
                            ) : null}
                            <div className={`w-full h-full flex items-center justify-center ${item.foto ? 'hidden' : ''}`}>
                              <FiUser className="w-6 h-6 text-slate-400" />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <h3 className="text-sm font-medium text-slate-900">{item.nama}</h3>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {item.jabatan}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {item.masaJabatan || '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Link 
                              href={`/admin/struktur/edit?id=${item.id}`} 
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50"
                              title="Edit"
                            >
                              <FiEdit className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => handleDelete(item.id, item.path)} 
                              className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                              title="Hapus"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </RequireAuth>
  )
}
