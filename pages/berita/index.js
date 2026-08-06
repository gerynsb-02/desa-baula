import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import CardBerita from '../../components/CardBerita'
import { db } from '../../lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { 
  FaNewspaper, FaCalendarAlt, FaExclamationTriangle, 
  FaFileAlt, FaArrowLeft, FaArrowRight, FaSync, FaSearch, FaTimes
} from 'react-icons/fa'

export default function Berita() {
  const [beritaList, setBeritaList] = useState([])
  const [filteredBeritaList, setFilteredBeritaList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9) // Number of news items per page
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        setLoading(true)
        const q = query(collection(db, 'berita'), orderBy('tanggal', 'desc'))
        const querySnapshot = await getDocs(q)
                 const data = querySnapshot.docs.map(doc => {
           const docData = doc.data()
           return {
             id: doc.id,
             ...docData,
             // Keep tanggal as original Firestore Timestamp for proper handling
             tanggal: docData.tanggal
           }
         })
        setBeritaList(data)
        setFilteredBeritaList(data)
      } catch (err) {
        console.error('Gagal mengambil data berita:', err)
        setError('Gagal memuat berita. Silakan coba lagi nanti.')
      } finally {
        setLoading(false)
      }
    }

    fetchBerita()
  }, [])

  // Filter berita based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBeritaList(beritaList)
    } else {
      const filtered = beritaList.filter(berita => 
        berita.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        berita.isi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        berita.kategori?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredBeritaList(filtered)
    }
    setCurrentPage(1) // Reset to first page when searching
  }, [searchTerm, beritaList])

  // Helper function to convert date to ISO string
  const dateToISOString = (dateField) => {
    try {
      if (!dateField) return new Date().toISOString()
      
      if (dateField.toDate && typeof dateField.toDate === 'function') {
        return dateField.toDate().toISOString()
      } else if (dateField.seconds) {
        return new Date(dateField.seconds * 1000).toISOString()
      } else if (dateField instanceof Date) {
        return dateField.toISOString()
      } else {
        return new Date(dateField).toISOString()
      }
    } catch (error) {
      console.error('Error converting date to ISO string:', error)
      return new Date().toISOString()
    }
  }

  // Format date for display
  const formatDate = (dateField) => {
    try {
      let date
      
      // If dateField is null, undefined, or empty, use current date
      if (!dateField) {
        date = new Date()
      } else if (typeof dateField === 'object') {
        // Firestore Timestamp
        if (dateField.seconds) {
          date = new Date(dateField.seconds * 1000)
        } else if (dateField.toDate && typeof dateField.toDate === 'function') {
          // Firestore Timestamp with toDate method
          date = dateField.toDate()
        } else if (dateField instanceof Date) {
          // Already a Date object
          date = dateField
        } else {
          // Try to parse as regular date object
          date = new Date(dateField)
        }
      } else if (typeof dateField === 'string' || typeof dateField === 'number') {
        // String or number
        date = new Date(dateField)
      } else {
        // Fallback to current date
        date = new Date()
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date field:', dateField)
        return 'Tanggal tidak tersedia'
      }
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch (error) {
      console.error('Error formatting date:', error, 'Field:', dateField)
      return 'Tanggal tidak tersedia'
    }
  }

  // Get current news items for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredBeritaList.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredBeritaList.length / itemsPerPage)

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
   <div className='pt-15'>
    <Layout 
      title="Berita & Pengumuman Desa Baula"
      description="Berita terbaru dan pengumuman resmi dari Desa Baula, Sulawesi Selatan. Update terkini tentang kegiatan, layanan publik, dan informasi penting kelurahan."
      keywords="berita desa baula, pengumuman desa baula, berita terbaru baula, informasi kelurahan baula, kegiatan desa, layanan publik baula, desabaula.site"
      image="/images/header.jpg"
      url="https://desabaula.site/berita"
      type="website"
    >
      {/* Structured Data for News Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Berita & Pengumuman - Desa Baula",
            "description": "Informasi terbaru seputar kegiatan, pengumuman, dan berita resmi dari Desa Baula",
            "url": "https://desabaula.site/berita",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": beritaList.slice(0, 10).map((berita, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "NewsArticle",
                  "headline": berita.judul,
                  "description": berita.isi?.substring(0, 200) + "...",
                                     "datePublished": dateToISOString(berita.tanggal),
                  "author": {
                    "@type": "Organization",
                    "name": "Desa Baula"
                  },
                  "publisher": {
                    "@type": "Organization",
                    "name": "Desa Baula",
                    "logo": {
                      "@type": "ImageObject",
                      "url": "https://desabaula.site/images/logo.png"
                    }
                  }
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
            <FaNewspaper className="text-lg" />
            Berita & Pengumuman
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            Berita & Pengumuman
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto"
          >
            Informasi terbaru seputar kegiatan dan pengumuman resmi Desa Baula
          </motion.p>
        </div>
      </div>

             <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                  {/* Combined Search & Info Section */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="mb-8 sm:mb-12"
         >
           <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
               {/* Search Section */}
               <div className="lg:col-span-2">
                 <div className="text-center lg:text-left mb-4">
                   <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6 }}
                     className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-4"
                   >
                     <FaSearch className="text-lg" />
                     Cari Berita
                   </motion.div>
                   <motion.h2 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: 0.1 }}
                     className="text-xl sm:text-2xl font-bold text-gray-800 mb-2"
                   >
                     Cari Berita & Pengumuman
                   </motion.h2>
                   <motion.p 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: 0.2 }}
                     className="text-gray-600 text-sm sm:text-base"
                   >
                     Temukan berita berdasarkan judul, isi, atau kategori
                   </motion.p>
                 </div>
                 
                 <div className="relative">
                   <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                   <input
                     type="text"
                     placeholder="Cari berita, pengumuman, atau kategori..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-12 pr-4 py-4 sm:py-5 text-sm sm:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white focus:bg-white text-gray-900"
                   />
                   {searchTerm && (
                     <button
                       onClick={() => setSearchTerm('')}
                       className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                     >
                       <FaTimes className="text-lg" />
                     </button>
                   )}
                 </div>
                 
                 {/* Search Results Info */}
                 {searchTerm && (
                   <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="mt-4 text-center lg:text-left"
                   >
                     <p className="text-sm text-gray-600 mb-3">
                       {filteredBeritaList.length === 0 ? (
                         <span className="text-red-600">Tidak ada hasil untuk &quot;{searchTerm}&quot;</span>
                       ) : filteredBeritaList.length === beritaList.length ? (
                         <span className="text-green-600">Menampilkan semua {beritaList.length} berita</span>
                       ) : (
                         <span className="text-blue-600">Ditemukan {filteredBeritaList.length} berita untuk &quot;{searchTerm}&quot;</span>
                       )}
                     </p>
                     {filteredBeritaList.length > 0 && (
                       <button
                         onClick={() => setSearchTerm('')}
                         className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 text-sm"
                       >
                         <FaSync className="text-xs" />
                         Hapus Filter
                       </button>
                     )}
                   </motion.div>
                 )}
               </div>

               {/* Info Section */}
               <div className="lg:col-span-1">
                 <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-xl p-6 border border-green-100">
                   <div className="flex items-center gap-4 mb-4">
                     <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-xl shadow-lg">
                       <FaNewspaper className="text-xl" />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-gray-800">
                         {searchTerm ? 'Hasil Pencarian' : 'Total Berita'}
                       </h3>
                       <p className="text-sm text-gray-600">
                         {filteredBeritaList.length} artikel tersedia
                         {searchTerm && filteredBeritaList.length !== beritaList.length && (
                           <span className="text-gray-500"> dari {beritaList.length} total</span>
                         )}
                       </p>
                     </div>
                   </div>
                   
                   <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                     <p className="text-sm text-gray-600 text-center">
                       Halaman {currentPage} dari {totalPages}
                     </p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </motion.div>

         {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-20 sm:py-32"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-green-600"></div>
              <p className="text-gray-600 text-sm sm:text-base">Memuat berita...</p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-700 px-6 sm:px-8 py-8 sm:py-12 rounded-2xl text-center max-w-2xl mx-auto"
          >
            <FaExclamationTriangle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 text-red-500" />
            <p className="text-lg sm:text-xl font-medium mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <FaSync />
              Coba Lagi
            </button>
          </motion.div>
                 ) : filteredBeritaList.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 sm:py-32"
          >
            <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-6 sm:mb-8">
              <FaFileAlt className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
            </div>
                         <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
               {searchTerm ? 'Tidak ada hasil pencarian' : 'Belum ada berita tersedia'}
             </h3>
             <p className="text-gray-600 text-sm sm:text-base">
               {searchTerm 
                 ? `Tidak ada berita yang cocok dengan pencarian &quot;${searchTerm}&quot;`
                 : 'Berita akan ditampilkan di sini setelah tersedia'
               }
             </p>
             {searchTerm && (
               <button
                 onClick={() => setSearchTerm('')}
                 className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center gap-2 mx-auto"
               >
                 <FaSync />
                 Hapus Pencarian
               </button>
             )}
          </motion.div>
        ) : (
          <>
            

            {/* News Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12"
            >
              {currentItems.map((berita, index) => (
                <motion.div
                  key={berita.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                                     <CardBerita
                     id={berita.id}
                     slug={berita.slug}
                     judul={berita.judul}
                     isi={berita.isi}
                     gambar={berita.gambar}
                     tanggal={berita.tanggal}
                     kategori={berita.kategori}
                   />
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex justify-center"
              >
                <nav className="flex items-center gap-2 bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg text-gray-700 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
                  >
                    <FaArrowLeft className="w-4 h-4" />
                    Sebelumnya
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                          currentPage === number 
                            ? 'bg-green-600 text-white shadow-md' 
                            : 'text-gray-700 hover:bg-green-100'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg text-gray-700 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
                  >
                    Selanjutnya
                    <FaArrowRight className="w-4 h-4" />
                  </button>
                </nav>
              </motion.div>
            )}
          </>
        )}
      </div>
    </Layout>
    </div>
  )
}