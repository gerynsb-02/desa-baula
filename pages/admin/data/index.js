import { useEffect, useState } from 'react'
import { doc, getDoc, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import RequireAuth from '../../../components/RequireAuth'
import AdminLayout from '../../../components/AdminLayout'
import Link from 'next/link'
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiBarChart2, 
  FiUsers,
  FiMapPin,
  FiCalendar,
  FiDatabase,
  FiTrendingUp,
  FiHome,
  FiUser,
  FiUserCheck
} from 'react-icons/fi'

export default function DataManagement() {
  const [penduduk, setPenduduk] = useState(null)
  const [sumber, setSumber] = useState(null)
  const [rwData, setRwData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pendudukSnap = await getDoc(doc(db, 'data_statistik', 'penduduk'))
        const sumberSnap = await getDoc(doc(db, 'data_statistik', 'sumber'))
        const rwSnap = await getDocs(collection(db, 'data_rw'))

        if (pendudukSnap.exists()) setPenduduk(pendudukSnap.data())
        if (sumberSnap.exists()) setSumber(sumberSnap.data())
        
        const rwList = rwSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // Sort RW data by nama (001, 002, 003, etc.)
        const sortedRwList = rwList.sort((a, b) => {
          const aNum = parseInt(a.nama.match(/\d+/)?.[0] || '0')
          const bNum = parseInt(b.nama.match(/\d+/)?.[0] || '0')
          return aNum - bNum
        })
        setRwData(sortedRwList)
      } catch (error) {
        console.error('Gagal mengambil data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleRwDelete = async (rwId) => {
    if (confirm('Apakah Anda yakin ingin menghapus data RW ini?')) {
      try {
        await deleteDoc(doc(db, 'data_rw', rwId))
        
        // Update terakhir diperbarui di sumber data
        await updateDoc(doc(db, 'data_statistik', 'sumber'), {
          terakhir_diperbarui: new Date()
        })
        
        // Refresh data
        const rwSnap = await getDocs(collection(db, 'data_rw'))
        const rwList = rwSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // Sort RW data by nama (001, 002, 003, etc.)
        const sortedRwList = rwList.sort((a, b) => {
          const aNum = parseInt(a.nama.match(/\d+/)?.[0] || '0')
          const bNum = parseInt(b.nama.match(/\d+/)?.[0] || '0')
          return aNum - bNum
        })
        setRwData(sortedRwList)
        
        // Refresh sumber data
        const sumberSnap = await getDoc(doc(db, 'data_statistik', 'sumber'))
        if (sumberSnap.exists()) setSumber(sumberSnap.data())
        
        alert('Data RW berhasil dihapus!')
      } catch (error) {
        console.error('Error deleting RW data:', error)
        alert('Gagal menghapus data RW')
      }
    }
  }

  if (loading) {
    return (
      <RequireAuth>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        </AdminLayout>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="animate-fade-in">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Manajemen Data Statistik</h1>
                {sumber && (
                  <p className="text-slate-600">
                    Terakhir diperbarui: {sumber.terakhir_diperbarui?.toDate().toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
              <Link 
                href="/admin/data/edit" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiEdit className="w-5 h-5" />
                Edit Data
              </Link>
            </div>
          </div>

          {!penduduk ? (
            <div className="text-center py-12">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiDatabase className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Data statistik belum tersedia</h3>
              <p className="text-slate-600 mb-6">Mulai dengan membuat data statistik kelurahan</p>
              <Link 
                href="/admin/data/edit" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl transition-all duration-200"
              >
                <FiPlus className="w-5 h-5" />
                Buat Data
              </Link>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                  title="Total Penduduk" 
                  value={penduduk.total} 
                  icon={<FiUsers className="w-6 h-6" />}
                  color="blue"
                  trend="+2.5%"
                />
                <StatCard 
                  title="Laki-laki" 
                  value={penduduk.laki_laki} 
                  icon={<FiUser className="w-6 h-6" />}
                  color="blue"
                />
                <StatCard 
                  title="Perempuan" 
                  value={penduduk.perempuan} 
                  icon={<FiUserCheck className="w-6 h-6" />}
                  color="pink"
                />
                <StatCard 
                  title="Jumlah KK" 
                  value={penduduk.jumlah_kk} 
                  icon={<FiHome className="w-6 h-6" />}
                  color="green"
                />
              </div>

              {/* Data Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Data Kependudukan */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FiUsers className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">Data Kependudukan</h2>
                      <p className="text-sm text-slate-600">Statistik penduduk kelurahan</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <DataItem label="Total Penduduk" value={penduduk.total} color="blue" />
                    <DataItem label="Laki-laki" value={penduduk.laki_laki} color="blue" />
                    <DataItem label="Perempuan" value={penduduk.perempuan} color="pink" />
                    <DataItem label="Jumlah KK" value={penduduk.jumlah_kk} color="green" />
                  </div>
                </div>

                {/* Data Wilayah */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FiMapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">Data Wilayah</h2>
                      <p className="text-sm text-slate-600">Informasi wilayah kelurahan</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <DataItem label="Jumlah RW" value={rwData.length} color="green" />
                    <DataItem label="Jumlah RT" value={penduduk.jumlah_rt} color="blue" />
                    <DataItem label="Luas Wilayah" value={`${penduduk.luas_wilayah} km²`} color="purple" />
                  </div>
                </div>
              </div>

              {/* Informasi Sumber Data */}
              {sumber && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FiDatabase className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">Informasi Sumber Data</h2>
                      <p className="text-sm text-slate-600">Detail sumber dan update data</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <FiDatabase className="w-4 h-4 text-slate-500" />
                        <span className="font-medium text-slate-700">Sumber Data:</span>
                      </div>
                      <p className="text-slate-800">{sumber.sumber_data}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <FiCalendar className="w-4 h-4 text-slate-500" />
                        <span className="font-medium text-slate-700">Terakhir Diperbarui:</span>
                      </div>
                      <p className="text-slate-800">
                        {sumber.terakhir_diperbarui?.toDate().toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Data RW Management */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-2">Data RW</h2>
                <p className="text-slate-600">
                  Total {rwData.length} RW • {rwData.filter(rw => rw.total_penduduk).length} RW memiliki data penduduk
                </p>
              </div>
              <Link
                href="/admin/data/tambah-rw"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiPlus className="w-5 h-5" />
                Tambah RW
              </Link>
            </div>

            {rwData.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMapPin className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Belum ada data RW</h3>
                <p className="text-slate-600 mb-6">Mulai dengan menambahkan data RW pertama</p>
                <Link
                  href="/admin/data/tambah-rw"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl transition-all duration-200"
                >
                  <FiPlus className="w-5 h-5" />
                  Tambah RW Pertama
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">RW</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Lokasi</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total Penduduk</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {rwData.map((rw, index) => (
                      <tr key={rw.id} className="hover:bg-slate-50 transition-colors duration-200">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{index + 1}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{rw.nama}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{rw.lokasi}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {rw.total_penduduk ? (
                            <span className="font-medium text-green-600">{rw.total_penduduk} orang</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {rw.total_penduduk ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Lengkap
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Belum Lengkap
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/data/edit-rw/${rw.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="Edit RW"
                            >
                              <FiEdit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleRwDelete(rw.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Hapus RW"
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
            )}
          </div>
        </div>
      </AdminLayout>
    </RequireAuth>
  )
}

function StatCard({ title, value, icon, color, trend }) {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    green: 'bg-gradient-to-br from-green-500 to-green-600',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
    pink: 'bg-gradient-to-br from-pink-500 to-pink-600',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <FiTrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </div>
  )
}

function DataItem({ label, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    pink: 'bg-pink-50 text-pink-700',
    orange: 'bg-orange-50 text-orange-700'
  }

  return (
    <div className="flex justify-between items-center p-3 rounded-xl border border-slate-100">
      <span className="font-medium text-slate-700">{label}</span>
      <span className={`font-bold px-3 py-1 rounded-lg text-sm ${colorClasses[color]}`}>
        {value}
      </span>
    </div>
  )
} 