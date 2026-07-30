import Layout from '../../components/Layout'
import Head from 'next/head'
import { db } from '../../lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  FaHistory, FaBullseye, FaUsers, FaMapMarkedAlt, FaLandmark, FaGlobe, FaUserFriends, FaMountain, FaUtensils, FaCheckCircle, FaClipboardList, FaUserTie, FaMapMarkerAlt, FaChartBar, FaHome, FaMale, FaFemale, FaIdCard, FaUser
} from 'react-icons/fa'

export default function Profil() {
  const [strukturList, setStrukturList] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('sejarah')

  useEffect(() => {
    const fetchStruktur = async () => {
      try {
        const strukturSnapshot = await getDocs(collection(db, 'struktur'))
        const strukturData = strukturSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        
        // Sort struktur data - Lurah first, then others
        const sortedStrukturData = strukturData.sort((a, b) => {
          const aIsLurah = a.jabatan.toLowerCase().includes('lurah')
          const bIsLurah = b.jabatan.toLowerCase().includes('lurah')
          
          if (aIsLurah && !bIsLurah) return -1
          if (!aIsLurah && bIsLurah) return 1
          return 0
        })
        
        setStrukturList(sortedStrukturData)
      } catch (error) {
        console.error('Error fetching struktur data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStruktur()
  }, [])

  return (
    <div className='pt-15'>
    <Layout 
      title="Profil Desa"
      description="Profil lengkap Desa Baula - Sejarah, visi misi, struktur pemerintahan, dan peta wilayah. Kenali lebih dekat kelurahan kami."
      keywords="profil kelurahan baula, sejarah kelurahan, visi misi kelurahan, struktur pemerintahan, peta wilayah kelurahan, kelurahan sulawesi selatan"
      image="/images/header.jpg"
      url="https://desa-baula.online/profil"
      type="website"
    >
      {/* Structured Data for Profile Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Profil Desa Baula",
            "description": "Profil lengkap Desa Baula - Sejarah, visi misi, struktur pemerintahan, dan peta wilayah",
            "url": "https://desa-baula.online/profil",
            "mainEntity": {
              "@type": "GovernmentOrganization",
              "name": "Desa Baula",
              "description": "Desa Baula adalah salah satu kelurahan di Sulawesi Selatan",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Baula",
                "addressRegion": "Sulawesi Selatan",
                "addressCountry": "ID"
              },
              "employee": strukturList.map(struktur => ({
                "@type": "Person",
                "name": struktur.nama,
                "jobTitle": struktur.jabatan,
                "worksFor": {
                  "@type": "Organization",
                  "name": "Desa Baula"
                }
              }))
            }
          })
        }}
      />

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
            <FaLandmark className="text-lg" />
            Profil Desa
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            Profil Desa Baula
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto"
          >
            Mengenal lebih dekat sejarah, visi misi, dan struktur pemerintahan Desa Baula
          </motion.p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm sticky top-16 z-10 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: 'sejarah', label: 'Sejarah', icon: FaHistory },
              { id: 'visi-misi', label: 'Visi & Misi', icon: FaBullseye },
              { id: 'struktur', label: 'Struktur', icon: FaUsers },
              { id: 'peta', label: 'Peta Wilayah', icon: FaMapMarkedAlt }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-base font-medium whitespace-nowrap border-b-2 transition-all duration-300 hover:bg-gray-50 ${activeTab === tab.id ? 'border-green-600 text-green-700 bg-green-50' : 'border-transparent text-gray-600 hover:text-green-600'}`}
              >
                <tab.icon className="text-sm sm:text-lg" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-16">
        {/* Sejarah Section */}
        <section id="sejarah" className="scroll-mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          >
            <div className="relative h-32 sm:h-48 md:h-64 lg:h-80 w-full">
              <Image
                width={1200}
                height={600}
                src="/images/header.jpg"
                alt="Foto sejarah Baula"
                className="object-cover w-full h-full"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 lg:bottom-6 lg:left-6">
                <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg flex items-center gap-2 sm:gap-3">
                  <FaHistory className="text-xl sm:text-2xl md:text-3xl lg:text-4xl" />
                  <span className="hidden sm:inline">Sejarah Desa Baula</span>
                  <span className="sm:hidden">Sejarah</span>
                </h2>
              </div>
            </div>
            <div className="p-3 sm:p-6 lg:p-8">
              <div className="prose max-w-none text-gray-700 space-y-4 sm:space-y-6 lg:space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-gradient-to-br from-green-50 to-white p-3 sm:p-4 lg:p-6 rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300"
                  >
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-green-700 mb-2 sm:mb-3 flex items-center gap-2">
                      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-1.5 sm:p-2 rounded-lg">
                        <FaLandmark className="text-lg sm:text-xl" />
                      </div>
                      Asal Usul
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                      Baula adalah desa di Kecamatan Tellu Limpoe, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan. Desa Baula merupakan salah satu desa yang terus berkembang di wilayah Kabupaten Sidrap.
                    </p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-gradient-to-br from-blue-50 to-white p-3 sm:p-4 lg:p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300"
                  >
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-blue-700 mb-2 sm:mb-3 flex items-center gap-2">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-1.5 sm:p-2 rounded-lg">
                        <FaGlobe className="text-lg sm:text-xl" />
                      </div>
                      Letak Geografis
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                      Terletak sekitar 48 km dari pusat kabupaten dengan waktu tempuh 1.5 jam. Wilayah ini dikelilingi oleh hamparan sawah dan dialiri sungai yang menjadi sumber kehidupan masyarakat.
                    </p>
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 sm:p-4 lg:p-6 rounded-xl border border-amber-100 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-amber-700 mb-2 sm:mb-3 flex items-center gap-2">
                    <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-1.5 sm:p-2 rounded-lg">
                      <FaUserFriends className="text-lg sm:text-xl" />
                    </div>
                    Kehidupan Masyarakat
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                    Mayoritas penduduk bekerja sebagai petani, pedagang, dan peternak. Masyarakat Desa Baula dikenal dengan semangat gotong royong yang tinggi dalam membangun daerahnya.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-gradient-to-br from-purple-50 to-white p-3 sm:p-4 lg:p-6 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300"
                  >
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-purple-700 mb-2 sm:mb-3 flex items-center gap-2">
                      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-1.5 sm:p-2 rounded-lg">
                        <FaMountain className="text-lg sm:text-xl" />
                      </div>
                      Potensi Wisata
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                      Desa Baula menawarkan potensi alam dan budaya yang beragam. Masyarakat desa terus berupaya mengembangkan potensi lokal untuk meningkatkan kesejahteraan warga.
                    </p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="bg-gradient-to-br from-red-50 to-white p-3 sm:p-4 lg:p-6 rounded-xl border border-red-100 hover:shadow-lg transition-all duration-300"
                  >
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-red-700 mb-2 sm:mb-3 flex items-center gap-2">
                      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-1.5 sm:p-2 rounded-lg">
                        <FaUtensils className="text-lg sm:text-xl" />
                      </div>
                      Budaya & Kuliner
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                      Memiliki kekayaan budaya seperti Festival Koro-Korona Balocci dan kuliner khas seperti Baruasa Tekko, Kopi Bulusaraung, dan Kopi Kedelai yang menjadi daya tarik wisatawan.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Visi Misi Section */}
        <section id="visi-misi" className="scroll-mt-32 sm:scroll-mt-36">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-green-100"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-800 mb-6 sm:mb-8 text-center flex items-center justify-center gap-2 sm:gap-3"
            >
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-2 sm:p-3 rounded-xl">
                <FaBullseye className="text-xl sm:text-2xl lg:text-3xl" />
              </div>
              <span className="hidden sm:inline">Visi & Misi Desa Baula</span>
              <span className="sm:hidden">Visi & Misi</span>
            </motion.h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Visi */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg border-l-4 border-green-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-gradient-to-br from-green-100 to-green-200 p-2 sm:p-3 lg:p-4 rounded-full mr-3 sm:mr-4 lg:mr-6">
                    <FaCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-700" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-700">Visi</h3>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 sm:p-6 lg:p-8 rounded-xl border border-green-200">
                  <p className="text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed font-medium italic text-center">
                    &ldquo;Tercapainya Pelayanan Kepada Masyarakat yang Inovatif dan Profesional&rdquo;
                  </p>
                </div>
              </motion.div>
              
              {/* Misi */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg border-l-4 border-green-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 sm:p-3 lg:p-4 rounded-full mr-3 sm:mr-4 lg:mr-6">
                    <FaClipboardList className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-700" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700">Misi</h3>
                </div>
                <ul className="space-y-2 sm:space-y-3 lg:space-y-4">
                  {[
                    "Mewujudkan pelayanan kepada dan sumber daya masyarakat yang berkualitas dan adil",
                    "Meningkatkan potensi sumber daya alam",
                    "Mewujudkan pembangunan berbasis kesejahteraan rakyat",
                    "Meningkatkan potensi pariwisata berbasis komunitas",
                    "Meningkatkan kebersamaan aparatur pemerintah dan masyarakat dalam membangun kreatifitas"
                  ].map((misi, index) => (
                    <motion.li 
                      key={index} 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
                      className="flex items-start group"
                    >
                      <span className="bg-gradient-to-br from-green-100 to-green-200 text-green-800 rounded-full w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex items-center justify-center mr-2 sm:mr-3 lg:mr-4 flex-shrink-0 group-hover:bg-green-300 transition-colors duration-200 text-xs sm:text-sm lg:text-base font-bold">
                        {index + 1}
                      </span>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed pt-0.5 sm:pt-1">
                        {misi}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Struktur Pemerintahan */}
        <section id="struktur" className="scroll-mt-32 sm:scroll-mt-36">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6 sm:mb-8 lg:mb-12"
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <FaUsers className="text-sm sm:text-lg" />
              <span className="hidden sm:inline">Struktur Pemerintahan</span>
              <span className="sm:hidden">Struktur</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-800 mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3">
              <FaUserTie className="text-2xl sm:text-3xl lg:text-4xl" />
              <span className="hidden sm:inline">Struktur Pemerintahan</span>
              <span className="sm:hidden">Struktur</span>
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto">
              Kenali para pemimpin dan struktur organisasi Desa Baula
            </p>
          </motion.div>
          
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center py-12 sm:py-16"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-green-700"></div>
                <p className="text-gray-600 text-sm sm:text-base">Memuat data struktur...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
            >
              {(() => {
                // Group by jabatan while preserving order
                const groupedStruktur = strukturList.reduce((acc, struktur) => {
                  const jabatan = struktur.jabatan;
                  if (!acc[jabatan]) {
                    acc[jabatan] = [];
                  }
                  acc[jabatan].push(struktur);
                  return acc;
                }, {});

                // Create ordered array of jabatan to preserve Lurah first order
                const orderedJabatan = [...new Set(strukturList.map(item => item.jabatan))];

                return orderedJabatan.map((jabatan, index) => {
                  const strukturGroup = groupedStruktur[jabatan];
                  return (
                    <motion.div 
                      key={jabatan}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="bg-gradient-to-r from-green-700 to-green-600 p-3 sm:p-4 lg:p-6 text-center">
                        <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white flex items-center justify-center gap-1 sm:gap-2">
                          <FaUserTie className="text-lg sm:text-xl lg:text-2xl" />
                          {jabatan}
                        </h3>
                      </div>
                      <div className="p-3 sm:p-4 lg:p-6">
                        {strukturGroup.length === 1 ? (
                          // Single person - show as card
                          <div className="text-center">
                            <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto rounded-full overflow-hidden border-2 sm:border-4 border-green-100 mb-3 sm:mb-4 shadow-lg bg-gray-100 flex items-center justify-center">
                              {strukturGroup[0].foto ? (
                                <Image 
                                  src={strukturGroup[0].foto} 
                                  alt={strukturGroup[0].nama} 
                                  width={160}
                                  height={160}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'flex'
                                  }}
                                />
                              ) : null}
                              <div className={`w-full h-full flex items-center justify-center ${strukturGroup[0].foto ? 'hidden' : ''}`}>
                                <FaUser className="text-lg sm:text-xl lg:text-2xl text-gray-400" />
                              </div>
                            </div>
                            <h4 className="text-sm sm:text-lg lg:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">{strukturGroup[0].nama}</h4>
                            <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-1 sm:mb-2">{jabatan}</p>
                            {strukturGroup[0].masaJabatan && (
                              <div className="bg-green-50 p-2 sm:p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Masa Jabatan</p>
                                <p className="text-xs sm:text-sm font-semibold text-green-700">{strukturGroup[0].masaJabatan}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          // Multiple people - show as list
                          <ul className="space-y-2 sm:space-y-3 lg:space-y-4">
                            {strukturGroup.map((struktur) => (
                              <li key={struktur.id} className="flex items-center p-2 sm:p-3 lg:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden mr-2 sm:mr-3 lg:mr-4 flex-shrink-0 border-2 border-green-200 bg-gray-100 flex items-center justify-center">
                                  {struktur.foto ? (
                                    <Image 
                                      src={struktur.foto} 
                                      alt={struktur.nama} 
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = 'none'
                                        e.target.nextSibling.style.display = 'flex'
                                      }}
                                    />
                                  ) : null}
                                  <div className={`w-full h-full flex items-center justify-center ${struktur.foto ? 'hidden' : ''}`}>
                                    <FaUser className="text-sm sm:text-lg lg:text-xl text-gray-400" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-800">{struktur.nama}</h4>
                                  <p className="text-xs text-gray-600">{jabatan}</p>
                                  {struktur.masaJabatan && (
                                    <p className="text-xs text-green-600 font-medium mt-0.5 sm:mt-1">Masa Jabatan: {struktur.masaJabatan}</p>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  );
                });
              })()}
            </motion.div>
          )}
        </section>

        {/* Peta Wilayah */}
        <section id="peta" className="scroll-mt-32 sm:scroll-mt-36">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6 sm:mb-8 lg:mb-12"
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <FaMapMarkedAlt className="text-sm sm:text-lg" />
              <span className="hidden sm:inline">Peta & Lokasi</span>
              <span className="sm:hidden">Peta</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-800 mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3">
              <FaMapMarkedAlt className="text-2xl sm:text-3xl lg:text-4xl" />
              <span className="hidden sm:inline">Peta & Batas Wilayah</span>
              <span className="sm:hidden">Peta Wilayah</span>
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto">
              Temukan lokasi dan batas wilayah Desa Baula
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          >
            <div className="p-4 sm:p-6 lg:p-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3"
              >
                <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-2 sm:p-3 rounded-xl">
                  <FaMapMarkedAlt className="text-xl sm:text-2xl lg:text-3xl" />
                </div>
                <span className="hidden sm:inline">Peta & Batas Wilayah</span>
                <span className="sm:hidden">Peta Wilayah</span>
              </motion.h2>
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg mb-4 sm:mb-6">
                <iframe 
                  src="https://maps.google.com/maps?q=Kantor%20Desa%20Baula,%20Tellu%20Limpoe,%20Sidrap&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="300"
                  className="h-[250px] sm:h-[350px] lg:h-[400px]"
                  style={{ border: 0 }}
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title='Peta Wilayah Desa Baula'
                ></iframe>
              </div>
              <div className="max-w-2xl mx-auto">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 lg:p-8 rounded-2xl border border-green-200"
                >
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-green-700 mb-3 sm:mb-4 flex items-center gap-2">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-1.5 sm:p-2 rounded-lg">
                      <FaMapMarkerAlt className="text-lg sm:text-xl" />
                    </div>
                    Batas Wilayah
                  </h3>
                  <ul className="space-y-2 sm:space-y-3 lg:space-y-4">
                    {[
                      { arah: 'Utara', batas: 'Kelurahan Balocci', icon: '⬆️' },
                      { arah: 'Timur', batas: 'Laut Flores', icon: '➡️' },
                      { arah: 'Selatan', batas: 'Kelurahan Bontoa', icon: '⬇️' },
                      { arah: 'Barat', batas: 'Kelurahan Bungoro', icon: '⬅️' }
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + (index * 0.1) }}
                        className="flex items-center p-2 sm:p-3 lg:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <span className="text-xl sm:text-2xl mr-2 sm:mr-3 lg:mr-4">{item.icon}</span>
                        <div className="flex-1">
                          <span className="text-xs sm:text-sm lg:text-base font-medium text-gray-700">{item.arah}:</span>
                          <span className="ml-1 sm:ml-2 text-xs sm:text-sm lg:text-base text-gray-600">{item.batas}</span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </Layout>
    </div>
  )
}