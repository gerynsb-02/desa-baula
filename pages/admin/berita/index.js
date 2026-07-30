// pages/admin/berita/index.js
import { useEffect, useState } from 'react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { db, storage } from '../../../lib/firebase'
import RequireAuth from '../../../components/RequireAuth'
import AdminLayout from '../../../components/AdminLayout'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiFileText, 
  FiCalendar,
  FiUser,
  FiEye,
  FiSearch,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi'

export default function ListBerita() {
  const [berita, setBerita] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({
    key: 'tanggal',
    direction: 'desc'
  })

  const fetchBerita = async () => {
    const snapshot = await getDocs(collection(db, 'berita'))
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setBerita(data)
    setLoading(false)
  }

  const handleDelete = async (id, path) => {
    if (confirm('Yakin ingin menghapus berita ini?')) {
      try {
        if (path) {
          const imageRef = ref(storage, path)
          await deleteObject(imageRef)
        }
        await deleteDoc(doc(db, 'berita', id))
        fetchBerita()
      } catch (err) {
        console.error('Gagal menghapus:', err)
        alert('Gagal menghapus data!')
      }
    }
  }

  // Sorting function
  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      let aValue, bValue

      if (key === 'tanggal') {
        // Handle Firestore Timestamp
        aValue = a.tanggal?.toDate ? a.tanggal.toDate() : (a.tanggal || new Date(0))
        bValue = b.tanggal?.toDate ? b.tanggal.toDate() : (b.tanggal || new Date(0))
      } else {
        aValue = a[key] || ''
        bValue = b[key] || ''
      }

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  // Handle sort click
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FiArrowUp className="w-4 h-4 opacity-30" />
    }
    return sortConfig.direction === 'asc' 
      ? <FiArrowUp className="w-4 h-4" />
      : <FiArrowDown className="w-4 h-4" />
  }

  const filteredBerita = berita.filter(item =>
    item.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.isi?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Apply sorting to filtered data
  const sortedBerita = sortData(filteredBerita, sortConfig.key, sortConfig.direction)

  useEffect(() => {
    fetchBerita()
  }, [])

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="animate-fade-in">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Kelola Berita</h1>
                <p className="text-slate-600">Tambah, edit, atau hapus berita kelurahan</p>
              </div>
              <Link 
                href="/admin/berita/tambah" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiPlus className="w-5 h-5" />
                Tambah Berita
              </Link>
            </div>
          </div>

          {/* Search and Sort Info */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="relative max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari berita..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                />
              </div>
              <p className="text-xs text-slate-500">
                💡 Klik pada header kolom untuk mengurutkan data
              </p>
            </div>
            
            {/* Sort Info */}
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <FiCalendar className="w-4 h-4" />
                <span>
                  Diurutkan berdasarkan: <span className="font-medium text-slate-800">
                    {sortConfig.key === 'tanggal' ? 'Tanggal' : 
                     sortConfig.key === 'judul' ? 'Judul' : 
                     sortConfig.key === 'sumber' ? 'Sumber' : 'Tanggal'}
                  </span>
                  {' '}
                  <span className="text-slate-500">
                    ({sortConfig.direction === 'desc' ? 'Terbaru' : 'Terlama'})
                  </span>
                </span>
              </div>
              
              {/* Total Items */}
              <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                {sortedBerita.length} berita
              </div>
              
              {/* Reset Sort Button */}
              {(sortConfig.key !== 'tanggal' || sortConfig.direction !== 'desc') && (
                <button
                  onClick={() => setSortConfig({ key: 'tanggal', direction: 'desc' })}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200 text-xs font-medium"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : sortedBerita.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFileText className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {searchTerm ? 'Tidak ada hasil pencarian' : 'Belum ada berita'}
              </h3>
              <p className="text-slate-600 mb-6">
                {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Mulai dengan menambahkan berita pertama'}
              </p>
              {!searchTerm && (
                <Link 
                  href="/admin/berita/tambah" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-200"
                >
                  <FiPlus className="w-5 h-5" />
                  Tambah Berita Pertama
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <tr>
                      <th 
                        className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-blue-800 transition-colors duration-200"
                        onClick={() => handleSort('judul')}
                      >
                        <div className="flex items-center gap-2">
                          Judul
                          {getSortIcon('judul')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-blue-800 transition-colors duration-200"
                        onClick={() => handleSort('tanggal')}
                      >
                        <div className="flex items-center gap-2">
                          Tanggal
                          {getSortIcon('tanggal')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-blue-800 transition-colors duration-200"
                        onClick={() => handleSort('sumber')}
                      >
                        <div className="flex items-center gap-2">
                          Sumber
                          {getSortIcon('sumber')}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {sortedBerita.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {item.gambar && (
                              <Image
                                width={48}
                                height={48}
                                src={item.gambar} 
                                alt={item.judul} 
                                className="w-12 h-12 object-cover rounded-lg mr-4"
                              />
                            )}
                            <div>
                              <h3 className="text-sm font-medium text-slate-900 line-clamp-2">{item.judul}</h3>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.isi?.substring(0, 100)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {item.tanggal?.toDate ? 
                            item.tanggal.toDate().toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 
                            'Tanggal tidak tersedia'
                          }
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {item.sumber || '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Link 
                              href={`/berita/${item.slug || item.id}`}
                              target="_blank"
                              className="text-slate-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50"
                              title="Lihat"
                            >
                              <FiEye className="w-4 h-4" />
                            </Link>
                            <Link 
                              href={`/admin/berita/edit?id=${item.id}`} 
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
