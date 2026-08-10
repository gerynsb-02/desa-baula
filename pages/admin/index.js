import { useEffect, useState } from 'react'
import { collection, getDocs, doc, getDoc, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import RequireAuth from '../../components/RequireAuth'
import AdminLayout from '../../components/AdminLayout'
import { 
  FiFileText, 
  FiUsers, 
  FiBarChart2, 
  FiEye,
  FiTrendingUp,
  FiCalendar,
  FiImage,
  FiShield,
  FiEdit,
  FiPlus,
  FiTrash2,
  FiBook,
  FiLayers
} from 'react-icons/fi'

export default function AdminDashboard() {
  const [jumlahBerita, setJumlahBerita] = useState(0)
  const [jumlahAdmin, setJumlahAdmin] = useState(0)
  const [jumlahData, setJumlahData] = useState(0)
  const [jumlahStruktur, setJumlahStruktur] = useState(0)
  const [jumlahGaleri, setJumlahGaleri] = useState(0)
  const [recentActivities, setRecentActivities] = useState([])
  const [loadingActivities, setLoadingActivities] = useState(true)

  // Function to format timestamp to relative time
  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Baru saja'
    
    const now = new Date()
    const time = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const diffInSeconds = Math.floor((now - time) / 1000)
    
    if (diffInSeconds < 60) return 'Baru saja'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`
    return `${Math.floor(diffInSeconds / 2592000)} bulan yang lalu`
  }

  // Function to get activity icon and color based on type
  const getActivityConfig = (type, action) => {
    const configs = {
      berita: {
        icon: <FiFileText className="w-5 h-5" />,
        color: 'blue',
        titles: {
          created: 'Berita baru ditambahkan',
          updated: 'Berita diperbarui',
          deleted: 'Berita dihapus'
        }
      },
      struktur: {
        icon: <FiUsers className="w-5 h-5" />,
        color: 'green',
        titles: {
          created: 'Struktur organisasi ditambahkan',
          updated: 'Struktur organisasi diperbarui',
          deleted: 'Struktur organisasi dihapus'
        }
      },
      galeri: {
        icon: <FiImage className="w-5 h-5" />,
        color: 'orange',
        titles: {
          created: 'Foto baru ditambahkan',
          updated: 'Foto diperbarui',
          deleted: 'Foto dihapus'
        }
      },
      data: {
        icon: <FiBarChart2 className="w-5 h-5" />,
        color: 'purple',
        titles: {
          created: 'Data statistik ditambahkan',
          updated: 'Data statistik diperbarui',
          deleted: 'Data statistik dihapus'
        }
      }
    }
    
    return configs[type] || {
      icon: <FiEdit className="w-5 h-5" />,
      color: 'gray',
      titles: { created: 'Item ditambahkan', updated: 'Item diperbarui', deleted: 'Item dihapus' }
    }
  }

  // Function to check if date is today
  const isToday = (timestamp) => {
    if (!timestamp) return false
    
    const today = new Date()
    const activityDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    
    return today.toDateString() === activityDate.toDateString()
  }

  // Function to fetch recent activities
  const fetchRecentActivities = async () => {
    try {
      setLoadingActivities(true)
      const activities = []

      // Fetch recent berita
      try {
        const beritaQuery = query(collection(db, 'berita'), orderBy('tanggal', 'desc'), limit(10))
        const beritaSnap = await getDocs(beritaQuery)
        beritaSnap.forEach(doc => {
          const data = doc.data()
          const timestamp = data.tanggal || data.createdAt || data.updatedAt
          
          // Only include activities from today
          if (isToday(timestamp)) {
            const action = data.updatedAt ? 'updated' : 'created'
            activities.push({
              id: doc.id,
              type: 'berita',
              action: action,
              title: data.judul || 'Berita',
              description: data.ringkasan || data.isi?.substring(0, 100) + '...' || 'Berita kelurahan',
              timestamp: timestamp,
              config: getActivityConfig('berita', action)
            })
          }
        })
      } catch (error) {
        console.log('Error fetching berita activities:', error)
      }

      // Fetch recent struktur
      try {
        const strukturQuery = query(collection(db, 'struktur'), orderBy('createdAt', 'desc'), limit(10))
        const strukturSnap = await getDocs(strukturQuery)
        strukturSnap.forEach(doc => {
          const data = doc.data()
          const timestamp = data.createdAt || data.updatedAt
          
          // Only include activities from today
          if (isToday(timestamp)) {
            const action = data.updatedAt ? 'updated' : 'created'
            activities.push({
              id: doc.id,
              type: 'struktur',
              action: action,
              title: data.nama || 'Struktur Organisasi',
              description: data.jabatan || 'Data struktur organisasi',
              timestamp: timestamp,
              config: getActivityConfig('struktur', action)
            })
          }
        })
      } catch (error) {
        console.log('Error fetching struktur activities:', error)
      }

      // Fetch recent galeri
      try {
        const galeriQuery = query(collection(db, 'galeri'), orderBy('createdAt', 'desc'), limit(10))
        const galeriSnap = await getDocs(galeriQuery)
        galeriSnap.forEach(doc => {
          const data = doc.data()
          const timestamp = data.createdAt || data.updatedAt
          
          // Only include activities from today
          if (isToday(timestamp)) {
            const action = data.updatedAt ? 'updated' : 'created'
            activities.push({
              id: doc.id,
              type: 'galeri',
              action: action,
              title: data.judul || 'Foto Galeri',
              description: data.deskripsi || 'Dokumentasi kegiatan',
              timestamp: timestamp,
              config: getActivityConfig('galeri', action)
            })
          }
        })
      } catch (error) {
        console.log('Error fetching galeri activities:', error)
      }

      // Sort all activities by timestamp and take the most recent 8
      const sortedActivities = activities
        .filter(activity => activity.timestamp)
        .sort((a, b) => {
          const timeA = a.timestamp.toDate ? a.timestamp.toDate() : new Date(a.timestamp)
          const timeB = b.timestamp.toDate ? b.timestamp.toDate() : new Date(b.timestamp)
          return timeB - timeA
        })
        .slice(0, 8)

      setRecentActivities(sortedActivities)
    } catch (error) {
      console.error('Error fetching recent activities:', error)
    } finally {
      setLoadingActivities(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [beritaSnap, adminSnap, strukturSnap, galeriSnap] = await Promise.all([
          getDocs(collection(db, 'berita')),
          getDocs(collection(db, 'admin')),
          getDocs(collection(db, 'struktur')),
          getDocs(collection(db, 'galeri'))
        ])

        setJumlahBerita(beritaSnap.size)
        setJumlahAdmin(adminSnap.size || 1)
        setJumlahStruktur(strukturSnap.size)
        setJumlahGaleri(galeriSnap.size)

        // Check if data exists
        try {
          const dataSnap = await getDoc(doc(db, 'data_statistik', 'penduduk'))
          setJumlahData(dataSnap.exists() ? 1 : 0)
        } catch (error) {
          setJumlahData(0)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchData()
    fetchRecentActivities()
  }, [])

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="animate-fade-in">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Admin</h1>
            <p className="text-slate-600">Selamat datang di panel administrasi Kelurahan Baula</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Berita" 
              value={jumlahBerita} 
              icon={<FiFileText className="w-6 h-6" />}
              color="blue"
            />
            <StatCard 
              title="Struktur Organisasi" 
              value={jumlahStruktur} 
              icon={<FiUsers className="w-6 h-6" />}
              color="green"
            />
            <StatCard 
              title="Data Statistik" 
              value={jumlahData} 
              icon={<FiBarChart2 className="w-6 h-6" />}
              color="purple"
            />
            <StatCard 
              title="Galeri Foto" 
              value={jumlahGaleri} 
              icon={<FiImage className="w-6 h-6" />}
              color="orange"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <QuickActionCard 
              title="Kelola Berita"
              description="Tambah, edit, atau hapus berita kelurahan"
              icon={<FiFileText className="w-8 h-8" />}
              href="/admin/berita"
              color="blue"
            />
            <QuickActionCard 
              title="Struktur Organisasi"
              description="Kelola data struktur organisasi kelurahan"
              icon={<FiUsers className="w-8 h-8" />}
              href="/admin/struktur"
              color="green"
            />
            <QuickActionCard 
              title="Galeri Foto"
              description="Kelola galeri foto kegiatan kelurahan"
              icon={<FiImage className="w-8 h-8" />}
              href="/admin/galeri"
              color="orange"
            />
            <QuickActionCard 
              title="Data & Statistik"
              description="Kelola data statistik penduduk"
              icon={<FiBarChart2 className="w-8 h-8" />}
              href="/admin/data"
              color="purple"
            />
            <QuickActionCard 
              title="Profil Kelurahan"
              description="Edit sejarah, visi misi, dan batas wilayah"
              icon={<FiBook className="w-8 h-8" />}
              href="/admin/profil"
              color="teal"
            />
            <QuickActionCard 
              title="Layanan Publik"
              description="Kelola alur, jenis layanan, dan jam operasional"
              icon={<FiLayers className="w-8 h-8" />}
              href="/admin/layanan"
              color="emerald"
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Aktivitas Terbaru</h2>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <FiCalendar className="w-4 h-4" />
                <span>Hari ini</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {loadingActivities ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <ActivityItem 
                    key={`${activity.type}-${activity.id}-${index}`}
                    icon={activity.config.icon}
                    title={activity.config.titles[activity.action]}
                    description={activity.title}
                    time={formatRelativeTime(activity.timestamp)}
                    color={activity.config.color}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <FiCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Belum ada aktivitas terbaru</p>
                </div>
              )}
            </div>
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

function QuickActionCard({ title, description, icon, href, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    teal: 'bg-teal-50 text-teal-600 hover:bg-teal-100',
    emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
  }

  return (
    <a 
      href={href}
      className={`block p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200 group ${colorClasses[color]}`}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform duration-200">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm opacity-80">{description}</p>
        </div>
      </div>
    </a>
  )
}

function ActivityItem({ icon, title, description, time, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  }

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors duration-200">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-slate-800 mb-1">{title}</h4>
        <p className="text-sm text-slate-600 mb-1">{description}</p>
        <p className="text-xs text-slate-500">{time}</p>
      </div>
    </div>
  )
}
