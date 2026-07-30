import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Head from 'next/head'
import { Bar, Pie, Doughnut } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import { motion } from 'framer-motion'
import { db } from '../../lib/firebase'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { 
  FaUsers, FaMale, FaFemale, FaHome, FaChartPie, 
  FaMapMarkerAlt, FaInfoCircle, FaCalendarAlt, FaDatabase
} from 'react-icons/fa'

// Register Chart.js components
Chart.register(...registerables)

export default function Data() {
  const [loading, setLoading] = useState(true)
  const [penduduk, setPenduduk] = useState(null)
  const [sumber, setSumber] = useState(null)
  const [rwData, setRwData] = useState([])

  // Fetch data dari Firestore
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

  // Jika masih loading
  if (loading) {
    return (
      <Layout title="Data & Statistik">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-green-600"></div>
            <p className="text-gray-600 text-sm sm:text-base">Memuat data statistik...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Jika tidak ada data
  if (!penduduk) {
    return (
      <Layout title="Data & Statistik">
        <div className="flex items-center justify-center min-h-screen text-gray-600">
          <div className="text-center">
            <FaDatabase className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-lg">Data tidak tersedia.</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Data chart dari Firestore
  const genderData = {
    labels: ['Laki-laki', 'Perempuan'],
    datasets: [
      {
        label: 'Jumlah Penduduk',
        data: [penduduk.laki_laki, penduduk.perempuan],
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(236, 72, 153, 0.8)'],
        borderColor: ['rgba(59, 130, 246, 1)', 'rgba(236, 72, 153, 1)'],
        borderWidth: 2
      }
    ]
  }

  const rwChartData = {
    labels: rwData.map(rw => rw.nama),
    datasets: [
      {
        label: 'Jumlah Penduduk per RW',
        data: rwData.map(rw => rw.total_penduduk || 0),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2
      }
    ]
  }

  return (
    <div className='pt-15'>
    <Layout title="Data & Statistik">
      <Head>
        <meta name="description" content="Data dan statistik terbaru Desa Baula" />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium mb-6"
          >
            <FaDatabase className="text-lg" />
            Data & Statistik
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            Data & Statistik Desa Baula
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto"
          >
            Informasi terbaru tentang kependudukan dan struktur wilayah
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12 lg:space-y-16">
        {/* Statistik Utama */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-4"
          >
            <FaChartPie className="text-lg" />
            Statistik Kependudukan
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3"
          >
            <FaChartPie className="text-3xl sm:text-4xl" />
            Statistik Kependudukan
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto"
          >
            Data terbaru kependudukan Desa Baula
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          <StatBox 
            title="Total Penduduk" 
            value={penduduk.total} 
            icon={<FaUsers />} 
            color="bg-blue-100 text-blue-600" 
            bgColor="bg-blue-50"
            borderColor="border-blue-200"
          />
          <StatBox 
            title="Penduduk Laki-laki" 
            value={penduduk.laki_laki} 
            icon={<FaMale />} 
            color="bg-blue-100 text-blue-600" 
            bgColor="bg-blue-50"
            borderColor="border-blue-200"
          />
                     <StatBox 
             title="Penduduk Perempuan" 
             value={penduduk.perempuan} 
             icon={<FaFemale />} 
             color="bg-pink-100 text-pink-600" 
             bgColor="bg-pink-50"
             borderColor="border-pink-200"
           />
           <StatBox 
             title="Jumlah RW" 
             value={rwData.length} 
             icon={<FaHome />} 
             color="bg-green-100 text-green-600" 
             bgColor="bg-green-50"
             borderColor="border-green-200"
           />
        </motion.div>

        {/* Grafik Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {/* Grafik Gender */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100"
          >
            <div className="text-center mb-6 sm:mb-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-lg">
                  <FaUsers className="text-xl sm:text-2xl" />
                </div>
                Data Kependudukan
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-gray-600 text-sm sm:text-base"
              >
                Berdasarkan Jenis Kelamin
              </motion.p>
            </div>
            <div className="h-64 sm:h-80 lg:h-96">
              <Doughnut 
                data={genderData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        font: {
                          size: 12
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </motion.div>

          {/* Grafik RW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100"
          >
            <div className="text-center mb-6 sm:mb-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3"
              >
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-2 rounded-lg">
                  <FaHome className="text-xl sm:text-2xl" />
                </div>
                Data per RW
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-gray-600 text-sm sm:text-base"
              >
                Jumlah Penduduk per Rukun Warga
              </motion.p>
            </div>
            <div className="h-64 sm:h-80 lg:h-96">
              <Bar 
                data={rwChartData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        font: {
                          size: 12
                        }
                      }
                    },
                    x: {
                      ticks: {
                        font: {
                          size: 11
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </motion.div>
        </div>

        {/* Lokasi RW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100"
        >
          <div className="text-center mb-6 sm:mb-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3"
            >
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-2 rounded-lg">
                <FaMapMarkerAlt className="text-xl sm:text-2xl" />
              </div>
              Informasi Lokasi RW
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-gray-600 text-sm sm:text-base"
            >
              Lokasi dan jumlah penduduk setiap Rukun Warga
            </motion.p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {rwData.map((rw, index) => (
              <motion.div 
                key={rw.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold mr-3 sm:mr-4 text-sm sm:text-base">
                    {rw.nama.split(' ')[1]}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-800">{rw.nama}</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-green-500" />
                    {rw.lokasi}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">
                    {rw.total_penduduk ? `${rw.total_penduduk} penduduk` : 'Data tidak tersedia'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Informasi Tambahan */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
        >
          {/* Struktur Wilayah */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="text-center mb-6 sm:mb-8">
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2"
              >
                <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-2 rounded-lg">
                  <FaHome className="text-lg sm:text-xl" />
                </div>
                Struktur Wilayah
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-gray-600 text-sm sm:text-base"
              >
                Pembagian administratif kelurahan
              </motion.p>
            </div>
                                      <div className="space-y-4 sm:space-y-6">
               <div className="flex justify-between items-center p-4 sm:p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                 <span className="text-sm sm:text-base font-medium text-gray-700">Jumlah RW</span>
                 <span className="text-lg sm:text-xl font-bold text-green-600">
                   {rwData.length} RW
                 </span>
               </div>
               <div className="flex justify-between items-center p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                 <span className="text-sm sm:text-base font-medium text-gray-700">Jumlah RT</span>
                 <span className="text-lg sm:text-xl font-bold text-blue-600">
                   {penduduk.jumlah_rt} RT
                 </span>
               </div>
             </div>
          </div>

          {/* Informasi Geografis */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="text-center mb-6 sm:mb-8">
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2"
              >
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-2 rounded-lg">
                  <FaMapMarkerAlt className="text-lg sm:text-xl" />
                </div>
                Informasi Geografis
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-gray-600 text-sm sm:text-base"
              >
                Data wilayah dan kependudukan
              </motion.p>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-between items-center p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <span className="text-sm sm:text-base font-medium text-gray-700">Luas Wilayah</span>
                <span className="text-lg sm:text-xl font-bold text-purple-600">
                  {penduduk.luas_wilayah} km²
                </span>
              </div>
              <div className="flex justify-between items-center p-4 sm:p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
                <span className="text-sm sm:text-base font-medium text-gray-700">Jumlah KK</span>
                <span className="text-lg sm:text-xl font-bold text-red-600">
                  {penduduk.jumlah_kk} KK
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sumber Data */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border border-blue-100"
        >
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-4"
            >
              <FaInfoCircle className="text-lg" />
              Sumber Data
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3"
            >
              <FaInfoCircle className="text-2xl sm:text-3xl" />
              Informasi Sumber Data
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto"
            >
              Data yang ditampilkan bersumber dari catatan resmi Desa Baula
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg mr-4">
                  <FaDatabase className="text-xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Sumber Data</h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                {sumber?.sumber_data || 'Data tidak tersedia'}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-lg mr-4">
                  <FaCalendarAlt className="text-xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Terakhir Diperbarui</h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                {sumber?.terakhir_diperbarui?.toDate().toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) || 'Tidak diketahui'}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
    </div>
  )
}

function StatBox({ title, value, icon, color, bgColor, borderColor }) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className={`${bgColor} ${borderColor} border-2 rounded-2xl shadow-lg p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-gray-50`}
    >
      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${color} flex items-center justify-center mx-auto mb-3 sm:mb-4 text-xl sm:text-2xl shadow-lg hover:shadow-xl transition-shadow duration-300`}>
        {icon}
      </div>
      <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{value}</p>
    </motion.div>
  )
}

