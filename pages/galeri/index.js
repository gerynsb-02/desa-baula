import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import Layout from '../../components/Layout'
import Head from 'next/head'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaImages, FaTimes, FaChevronLeft, FaChevronRight, 
  FaSpinner, FaExclamationTriangle, FaEye, FaFilePdf,
  FaExternalLinkAlt, FaBook
} from 'react-icons/fa'

export default function GaleriPage() {
  const [galeriList, setGaleriList] = useState([])
  const [bukuList, setBukuList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState(null)
  const imagesPerPage = 12

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        setError(null)

        const [galeriSnap, bukuSnap] = await Promise.all([
          getDocs(query(collection(db, 'galeri'), orderBy('createdAt', 'desc'))),
          getDocs(query(collection(db, 'buku_panduan'), orderBy('createdAt', 'desc'))),
        ])

        setGaleriList(galeriSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        setBukuList(bukuSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Gagal memuat galeri. Silakan coba lagi nanti.')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])


  // Get current images for pagination
  const indexOfLastImage = currentPage * imagesPerPage
  const indexOfFirstImage = indexOfLastImage - imagesPerPage
  const currentImages = galeriList.slice(indexOfFirstImage, indexOfLastImage)
  const totalPages = Math.ceil(galeriList.length / imagesPerPage)

  const openImage = (index) => {
    // Calculate the actual index in the full array
    const actualIndex = indexOfFirstImage + index
    setSelectedImage(galeriList[actualIndex].url)
    setCurrentIndex(actualIndex)
  }

  const closeImage = () => {
    setSelectedImage(null)
  }

  const navigate = (direction) => {
    let newIndex = currentIndex + direction
    if (newIndex < 0) newIndex = galeriList.length - 1
    if (newIndex >= galeriList.length) newIndex = 0
    setCurrentIndex(newIndex)
    setSelectedImage(galeriList[newIndex].url)
  }

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getAltText = (url) => {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      const filename = pathname.split('/').pop().split('?')[0]
      return filename || 'Galeri Kelurahan Baula'
    } catch {
      return 'Galeri Kelurahan Baula'
    }
  }

  return (
    <div className='pt-15'>
    <Layout>
      <Head>
        <title>Galeri - Kelurahan Baula</title>
        <meta name="description" content="Galeri foto kegiatan Kelurahan Baula" />
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
            <FaImages className="text-lg" />
            Galeri Kegiatan
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            Galeri Kegiatan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto"
          >
            Dokumentasi kegiatan dan momen penting Kelurahan Baula
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-20 sm:py-32"
          >
            <div className="flex flex-col items-center gap-4">
              <FaSpinner className="animate-spin text-4xl sm:text-5xl text-green-600" />
              <p className="text-gray-600 text-sm sm:text-base">Memuat galeri...</p>
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
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
            >
              Coba Lagi
            </button>
          </motion.div>
        ) : galeriList.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 sm:py-32"
          >
            <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-6 sm:mb-8">
              <FaImages className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Belum ada gambar di galeri</h3>
            <p className="text-gray-600 text-sm sm:text-base">Galeri akan ditampilkan di sini setelah tersedia</p>
          </motion.div>
        ) : (
          <>
            {/* Gallery Info */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-2xl shadow-xl p-6 sm:p-8 border border-blue-100 mb-8 sm:mb-12"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl shadow-lg">
                    <FaImages className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Total Foto</h2>
                    <p className="text-sm sm:text-base text-gray-600">{galeriList.length} foto tersedia</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm sm:text-base text-gray-600">Halaman {currentPage} dari {totalPages}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ===== GALLERY GRID ===== */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 mb-10 sm:mb-12"
            >
              {currentImages.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white hover:scale-105 transform"
                  onClick={() => openImage(index)}
                >
                  <div className="aspect-square relative">
                    <Image
                      width={300}
                      height={300}
                      src={item.url}
                      alt={item.title || getAltText(item.url)}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      unoptimized={true}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <FaEye className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  {item.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="text-white text-xs sm:text-sm font-medium truncate">{item.title}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex justify-center mb-16"
              >
                <nav className="flex items-center gap-2 bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg text-gray-700 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
                  >
                    <FaChevronLeft className="w-4 h-4" />
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
                    <FaChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              </motion.div>
            )}

            {/* ===== HILIRASI KKN 116 UNHAS SECTION ===== */}
            {bukuList.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="pt-6 border-t-2 border-dashed border-gray-200"
              >
                {/* Section Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-xl shadow-lg">
                    <FaBook className="text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Hilirasi KKN 116 Unhas</h2>
                    <p className="text-sm text-gray-500">{bukuList.length} dokumen tersedia</p>
                  </div>
                </div>

                {/* Buku Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bukuList.map((buku, index) => (
                    <motion.div
                      key={buku.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:border-red-200 transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      {/* ===== COVER / PREVIEW AREA ===== */}
                      {buku.thumbnailUrl ? (
                        /* Foto sampul dari admin */
                        <div className="relative w-full h-52 overflow-hidden bg-gray-100">
                          <Image
                            src={buku.thumbnailUrl}
                            alt={`Sampul ${buku.judul}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          {/* PDF badge */}
                          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
                            <FaFilePdf className="text-xs" />
                            PDF
                          </div>
                        </div>
                      ) : (
                        /* Placeholder stylized jika belum ada foto sampul */
                        <div className="w-full h-52 bg-gradient-to-br from-red-600 via-red-500 to-rose-600 flex flex-col items-center justify-center relative overflow-hidden">
                          {/* Decorative circles */}
                          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
                          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" />
                          {/* Icon */}
                          <FaFilePdf className="text-6xl text-white/70 mb-2 relative z-10" />
                          <span className="text-white/80 text-xs font-semibold tracking-widest uppercase relative z-10">
                            KKN 116 Unhas
                          </span>
                        </div>
                      )}

                      {/* ===== CARD BODY ===== */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-700 transition-colors duration-200 text-base mb-1">
                          {buku.judul}
                        </h3>
                        {buku.deskripsi && (
                          <p className="text-sm text-gray-500 line-clamp-2 mb-2">{buku.deskripsi}</p>
                        )}
                        {buku.namaFile && (
                          <p className="text-xs text-gray-400 truncate mb-3">{buku.namaFile}</p>
                        )}

                        {/* Spacer agar tombol selalu di bawah */}
                        <div className="flex-1" />

                        {/* Tombol: buka via signed URL agar tidak kena 401 Cloudinary */}
                        <a
                          href={`/api/pdf-signed-url?publicId=${encodeURIComponent(buku.path)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md active:scale-95"
                        >
                          <FaFilePdf className="text-sm flex-shrink-0" />
                          Buka Dokumen
                          <FaExternalLinkAlt className="text-xs ml-1 flex-shrink-0" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Enhanced Image Preview Modal */}
            <AnimatePresence>
              {selectedImage && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                  onClick={closeImage}
                >
                  <div className="relative max-w-6xl w-full h-full flex items-center justify-center">
                    {/* Close Button */}
                    <button 
                      onClick={closeImage}
                      className="absolute top-4 right-4 text-white hover:text-green-400 transition-colors z-10 bg-black/50 rounded-full p-2"
                      aria-label="Close preview"
                    >
                      <FaTimes className="w-6 h-6" />
                    </button>

                    {/* Navigation Buttons */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                      className="absolute left-4 text-white hover:text-green-400 transition-colors z-10 bg-black/50 rounded-full p-3"
                      aria-label="Previous image"
                    >
                      <FaChevronLeft className="w-6 h-6" />
                    </button>

                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(1); }}
                      className="absolute right-4 text-white hover:text-green-400 transition-colors z-10 bg-black/50 rounded-full p-3"
                      aria-label="Next image"
                    >
                      <FaChevronRight className="w-6 h-6" />
                    </button>

                    {/* Image Container */}
                    <div 
                      className="relative w-full h-full flex items-center justify-center" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={selectedImage}
                          alt={galeriList[currentIndex]?.title || getAltText(selectedImage)}
                          fill
                          className="object-contain"
                          unoptimized={true}
                          priority
                        />
                      </div>

                      {/* Judul & deskripsi jika ada */}
                      {(galeriList[currentIndex]?.title || galeriList[currentIndex]?.description) && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white bg-black/60 rounded-lg px-6 py-3">
                          {galeriList[currentIndex]?.title && (
                            <p className="font-medium text-lg">{galeriList[currentIndex].title}</p>
                          )}
                          {galeriList[currentIndex]?.description && (
                            <p className="text-sm text-gray-300 mt-1">{galeriList[currentIndex].description}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 rounded-full px-4 py-2">
                      {currentIndex + 1} / {galeriList.length}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </Layout>
    </div>
  )
}