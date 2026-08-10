import { useRouter } from 'next/router'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { 
  FaHome, FaNewspaper, FaCalendarAlt, FaUser, 
  FaArrowLeft, FaExclamationTriangle, FaSpinner,
  FaShare, FaFacebook, FaTwitter, FaWhatsapp,
  FaClock, FaBuilding, FaEye, FaBookmark, FaPrint,
  FaEnvelope, FaLink, FaTag, FaUserTie, FaMapMarkerAlt,
  FaChevronRight, FaRegNewspaper, FaUserCircle, FaGlobe
} from 'react-icons/fa'
import Image from 'next/image'

export default function DetailBerita({ berita: initialBerita, error: initialError }) {
  const router = useRouter()
  const { id: slug } = router.query
  const [berita, setBerita] = useState(initialBerita)
  const [loading, setLoading] = useState(!initialBerita && !initialError)
  const [error, setError] = useState(initialError)

  useEffect(() => {
    if (slug) {
      const fetchData = async () => {
        try {
          setLoading(true)
          setError(null)
          
          // Query by slug instead of document ID
          let q = query(collection(db, 'berita'), where('slug', '==', slug))
          let querySnapshot = await getDocs(q)

          // If not found by slug, try by ID (fallback for old URLs)
          if (querySnapshot.empty) {
            const { doc, getDoc } = await import('firebase/firestore')
            const docRef = doc(db, 'berita', slug)
            const docSnap = await getDoc(docRef)
            
            if (docSnap.exists()) {
              setBerita({ id: docSnap.id, ...docSnap.data() })
            } else {
              setError('Artikel tidak ditemukan')
            }
          } else {
            const doc = querySnapshot.docs[0]
            setBerita({ id: doc.id, ...doc.data() })
          }
        } catch (error) {
          console.error('Gagal mengambil detail:', error)
          setError('Gagal memuat artikel')
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    }
  }, [slug])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = berita ? `${berita.judul} - Kelurahan Baula` : ''

  const handleShare = (platform) => {
    let url = ''
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
        break
      default:
        return
    }
    window.open(url, '_blank', 'width=600,height=400')
  }

  if (loading) return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">Memuat artikel...</h2>
            <p className="text-gray-600">Mohon tunggu sebentar</p>
          </div>
        </motion.div>
      </div>
    </Layout>
  )

  if (error || !berita) return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md w-full"
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-red-100">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-3xl text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Artikel Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-8">{error || 'Artikel yang Anda cari tidak dapat ditemukan'}</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => router.back()} 
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors duration-200"
              >
                Kembali ke Halaman Sebelumnya
              </button>
              <button 
                onClick={() => router.push('/berita')} 
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-200"
              >
                Lihat Semua Berita
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  )

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

  // Handle different date formats
  const formatDate = (dateField) => {
    try {
      let date
      
      if (!dateField) {
        date = new Date()
      } else if (typeof dateField === 'object') {
        if (dateField.seconds) {
          date = new Date(dateField.seconds * 1000)
        } else if (dateField.toDate && typeof dateField.toDate === 'function') {
          date = dateField.toDate()
        } else if (dateField instanceof Date) {
          date = dateField
        } else {
          date = new Date(dateField)
        }
      } else if (typeof dateField === 'string' || typeof dateField === 'number') {
        date = new Date(dateField)
      } else {
        date = new Date()
      }
      
      if (isNaN(date.getTime())) {
        console.warn('Invalid date field:', dateField)
        return 'Tanggal tidak tersedia'
      }
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Error formatting date:', error, 'Field:', dateField)
      return 'Tanggal tidak tersedia'
    }
  }

  const tanggalFormatted = formatDate(berita.tanggal)
  
  const formatDateMeta = (dateField) => {
    try {
      let date
      
      if (!dateField) {
        date = new Date()
      } else if (typeof dateField === 'object') {
        if (dateField.seconds) {
          date = new Date(dateField.seconds * 1000)
        } else if (dateField.toDate && typeof dateField.toDate === 'function') {
          date = dateField.toDate()
        } else if (dateField instanceof Date) {
          date = dateField
        } else {
          date = new Date(dateField)
        }
      } else if (typeof dateField === 'string' || typeof dateField === 'number') {
        date = new Date(dateField)
      } else {
        date = new Date()
      }
      
      if (isNaN(date.getTime())) {
        return 'Tanggal tidak tersedia'
      }
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch (error) {
      return 'Tanggal tidak tersedia'
    }
  }

  const readingTime = Math.ceil(berita.isi.split(' ').length / 200)
  const wordCount = berita.isi.split(' ').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
             <Layout 
         title={berita.judul}
         description={berita.isi.substring(0, 160) + '...'}
         keywords={`${berita.judul}, berita kelurahan baula, ${berita.kategori || 'informasi desa'}, kelurahan baula`}
         image={berita.gambar || '/images/header.jpg'}
         url={`/berita/${berita.slug || berita.id}`}
         type="article"
       >
        {/* Structured Data for News Article */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              "headline": berita.judul,
              "description": berita.isi.substring(0, 200) + "...",
              "image": berita.gambar ? (berita.gambar.startsWith('http') ? berita.gambar : `https://desabaula.site${berita.gambar}`) : "https://desabaula.site/images/header.jpg",
              "image:width": 1200,
              "image:height": 630,
              "datePublished": dateToISOString(berita.tanggal),
              "dateModified": dateToISOString(berita.tanggal),
              "author": {
                "@type": "Organization",
                "name": "Kelurahan Baula",
                "url": "https://desabaula.site"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Kelurahan Baula",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://desabaula.site/images/logo.png"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://desabaula.site/berita/${berita.slug || berita.id}`
              },
              "wordCount": wordCount,
              "timeRequired": `PT${readingTime}M`,
              "articleSection": berita.kategori || "Berita Umum",
              "keywords": `${berita.judul}, berita kelurahan baula, ${berita.kategori || 'informasi desa'}`
            })
          }}
        />

        {/* Article Container */}
        <div className="max-w-5xl mx-auto px-4 py-20 mt-5">
          {/* Professional Breadcrumb */}
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
            aria-label="Breadcrumb"
          >
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <button 
                onClick={() => router.push('/')}
                className="flex items-center hover:text-emerald-600 transition-colors duration-200"
              >
                <FaHome className="w-4 h-4 mr-1" />
                Beranda
              </button>
              <FaChevronRight className="w-3 h-3 text-gray-400" />
              <button 
                onClick={() => router.push('/berita')}
                className="hover:text-emerald-600 transition-colors duration-200"
              >
                Berita
              </button>
              <FaChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-900 font-medium truncate max-w-xs">
                {berita.judul.length > 50 ? berita.judul.substring(0, 50) + '...' : berita.judul}
              </span>
            </div>
          </motion.nav>

          {/* Article Header */}
          <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            {/* Category Badge */}
            {berita.kategori && (
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                  <FaTag className="w-3 h-3 mr-2" />
                  {berita.kategori}
                </span>
              </div>
            )}

            {/* Article Title */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-6 tracking-tight">
              {berita.judul}
            </h1>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-gray-200">
              
              <div className="flex items-center text-gray-600">
                <FaCalendarAlt className="w-5 h-5 mr-2 text-emerald-600" />
                <time dateTime={dateToISOString(berita.tanggal)}>
                  {formatDateMeta(berita.tanggal)}
                </time>
              </div>
              
              <div className="flex items-center text-gray-600">
                <FaClock className="w-5 h-5 mr-2 text-emerald-600" />
                <span>{readingTime} menit baca</span>
              </div>

              {berita.sumber && (
                <div className="flex items-center text-gray-600">
                  <FaGlobe className="w-5 h-5 mr-2 text-emerald-600" />
                  <span>{berita.sumber}</span>
                </div>
              )}
            </div>
          </motion.header>

          {/* Featured Image */}
          {berita.gambar && (
            <motion.figure 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12 rounded-2xl overflow-hidden shadow-2xl"
            >
                <div className="relative aspect-video">
                 <Image
                   width={1200}
                   height={675}
                   src={berita.gambar}
                   alt={berita.judul}
                   className="w-full h-full object-cover"
                   priority
                   unoptimized
                   style={{ pointerEvents: 'auto' }}
                 />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
               </div>
              {berita.kreditGambar && (
                <figcaption className="bg-gray-50 px-6 py-3 text-sm text-gray-600">
                  <span className="font-medium">Foto:</span> {berita.kreditGambar}
                </figcaption>
              )}
            </motion.figure>
          )}

          {/* Article Content */}
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg max-w-none"
          >
            <div className="text-gray-800 leading-relaxed">
              {berita.isi.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-6 text-lg leading-8 text-gray-700 text-justify">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </motion.article>

          {/* Tags Section */}
          {berita.tags && berita.tags.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 pt-8 border-t border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tag Artikel</h3>
              <div className="flex flex-wrap gap-2">
                {berita.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.section>
          )}

          {/* Share Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Bagikan Artikel</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200"
              >
                <FaFacebook className="w-5 h-5 mr-2" />
                Facebook
              </button>
              
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-xl transition-colors duration-200"
              >
                <FaTwitter className="w-5 h-5 mr-2" />
                Twitter
              </button>
              
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors duration-200"
              >
                <FaWhatsapp className="w-5 h-5 mr-2" />
                WhatsApp
              </button>
              
              <button
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors duration-200"
              >
                <FaLink className="w-5 h-5 mr-2" />
                Salin Link
              </button>
            </div>
          </motion.section>

          {/* Back Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <button
                onClick={() => router.push('/berita')}
                className="flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors duration-200 order-2 sm:order-1"
              >
                <FaArrowLeft className="w-5 h-5 mr-2" />
                Kembali ke Berita
              </button>
              
              <div className="text-sm text-gray-500 text-center order-1 sm:order-2">
                <p>Terakhir diperbarui: {tanggalFormatted}</p>
                <p className="mt-1">© {new Date().getFullYear()} Kelurahan Baula</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Layout>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { id: slug } = context.params

  try {
    // Query by slug
    let q = query(collection(db, 'berita'), where('slug', '==', slug))
    let querySnapshot = await getDocs(q)

    let berita = null

    // If not found by slug, try by ID (fallback for old URLs)
    if (querySnapshot.empty) {
      const { doc, getDoc } = await import('firebase/firestore')
      const docRef = doc(db, 'berita', slug)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        berita = { id: docSnap.id, ...docSnap.data() }
      }
    } else {
      const doc = querySnapshot.docs[0]
      berita = { id: doc.id, ...doc.data() }
    }

    if (!berita) {
      return {
        props: {
          berita: null,
          error: 'Artikel tidak ditemukan'
        }
      }
    }

    // Convert Firestore Timestamp objects to ISO strings for JSON serialization
    const convertTimestamps = (obj) => {
      if (!obj || typeof obj !== 'object') return obj
      
      const converted = { ...obj }
      
      // Convert known timestamp fields
      if (converted.tanggal && converted.tanggal.toDate) {
        converted.tanggal = converted.tanggal.toDate().toISOString()
      }
      if (converted.createdAt && converted.createdAt.toDate) {
        converted.createdAt = converted.createdAt.toDate().toISOString()
      }
      if (converted.updatedAt && converted.updatedAt.toDate) {
        converted.updatedAt = converted.updatedAt.toDate().toISOString()
      }
      
      return converted
    }

    const serializedBerita = convertTimestamps(berita)

    return {
      props: {
        berita: serializedBerita,
        error: null
      }
    }
  } catch (error) {
    console.error('Error in getServerSideProps:', error)
    return {
      props: {
        berita: null,
        error: 'Gagal memuat artikel'
      }
    }
  }
}