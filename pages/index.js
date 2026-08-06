import Layout from '../components/Layout'
import CardBerita from '../components/CardBerita'
import CardStruktur from '../components/CardStruktur'
import { db } from '../lib/firebase'
import { collection, getDocs, orderBy, query, limit, doc, getDoc } from 'firebase/firestore'
import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import ScrollNavigator from '../components/ScrollNavigator'
import NextImage from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaUsers, FaMale, FaFemale, FaHome, FaInfoCircle, FaDatabase, FaUserTie, FaMapMarkerAlt, FaPhone, FaQuoteLeft, FaEnvelope, FaNewspaper, FaArrowRight, FaImage, FaExpand, FaChevronLeft, FaChevronRight, FaTimes, FaUser
} from 'react-icons/fa'
import Link from 'next/link'

export default function Home() {
  const [beritaList, setBeritaList] = useState([])
  const [strukturList, setStrukturList] = useState([])
  const [galeriList, setGaleriList] = useState([])
  const [lurah, setLurah] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null);
  const [heroImages, setHeroImages] = useState([])
  const [penduduk, setPenduduk] = useState(null)
  const [loading, setLoading] = useState({
    berita: true,
    struktur: true,
    galeri: true,
    hero: true,
    penduduk: true
  })

  // HERO CAROUSEL
  const [heroIndex, setHeroIndex] = useState(0);
  const heroTimeout = useRef(null);

  // Preload hero images for instant switching
  useEffect(() => {
    if (heroImages.length > 0) {
      heroImages.forEach((image) => {
        const img = new window.Image();
        img.src = image.url;
      });
    }
  }, [heroImages]);

  // Auto-slide with immediate transition
  useEffect(() => {
    if (heroImages.length > 0) {
      heroTimeout.current && clearTimeout(heroTimeout.current);
      heroTimeout.current = setTimeout(() => {
        setHeroIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => {
        if (heroTimeout.current) {
          clearTimeout(heroTimeout.current);
        }
      };
    }
  }, [heroIndex, heroImages.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Hero Images
        const heroDoc = await getDoc(doc(db, 'settings', 'hero'))
        if (heroDoc.exists()) {
          const heroData = heroDoc.data()
          setHeroImages(heroData.images || [])
        } else {
          // Fallback to default images if no hero settings
          setHeroImages([
            { url: '/images/header.jpg', title: 'Pemandangan Desa Baula 1' },
            { url: '/images/header2.jpg', title: 'Pemandangan Desa Baula 2' }
          ])
        }

        // Fetch Berita
        const beritaQuery = query(collection(db, 'berita'), orderBy('tanggal', 'desc'), limit(4))
        const beritaSnapshot = await getDocs(beritaQuery)
        setBeritaList(beritaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))

        // Fetch Struktur
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
        setLurah(sortedStrukturData.find(item => item.jabatan.toLowerCase().includes('lurah')))

        // Fetch Galeri
        const galeriQuery = query(collection(db, 'galeri'), orderBy('createdAt', 'desc'), limit(8))
        const galeriSnapshot = await getDocs(galeriQuery)
        setGaleriList(galeriSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))

        // Fetch Data Kependudukan
        const pendudukSnap = await getDoc(doc(db, 'data_statistik', 'penduduk'))
        if (pendudukSnap.exists()) {
          setPenduduk(pendudukSnap.data())
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        // Fallback to default images on error
        setHeroImages([
          { url: '/images/header.jpg', title: 'Pemandangan Desa Baula 1' },
          { url: '/images/header2.jpg', title: 'Pemandangan Desa Baula 2' }
        ])
      } finally {
        setLoading({
          berita: false,
          struktur: false,
          galeri: false,
          hero: false,
          penduduk: false
        })
      }
    }

    fetchData()
  }, [])



  const totalPenduduk = penduduk ? (penduduk.laki_laki + penduduk.perempuan) : 0
  const totalKK = penduduk ? penduduk.jumlah_kk : 0

  return (
    <Layout
      title="Beranda | Website Resmi Desa Baula"
      description="Website resmi Desa Baula, Sulawesi Selatan. Temukan informasi layanan publik, berita terkini, profil kelurahan, statistik kependudukan, dan galeri kegiatan desa."
      keywords="desa baula, desabaula.site, kelurahan baula, beranda, layanan publik baula, berita desa baula, profil kelurahan baula, pemerintah desa, sulawesi selatan, sulsel"
      image="/images/header.jpg"
      url="https://desabaula.site"
      type="website"
    >
      {/* Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Beranda - Desa Baula",
            "description": "Website resmi Desa Baula, Sulawesi Selatan. Informasi layanan publik, berita terkini, dan profil kelurahan.",
            "url": "https://desabaula.site",
            "mainEntity": {
              "@type": "WebSite",
              "name": "Desa Baula",
              "url": "https://desabaula.site",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://desabaula.site/berita?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          })
        }}
      />

      {/* Preload hero images */}
      {heroImages.map((image, index) => (
        <link key={index} rel="preload" as="image" href={image.url} />
      ))}

      {/* Custom CSS for smooth animations */}
      <style jsx global>{`
        @keyframes zoomInOut {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-pulse-slow {
          animation: zoomInOut 20s ease-in-out infinite;
        }
      `}</style>

      {/* Hidden preload images */}
      <div className="hidden">
        {heroImages.map((image, index) => (
          <NextImage key={index} src={image.url} alt="" width={1} height={1} />
        ))}
      </div>

      {/* Hero Section - Premium Version */}
      <section className="relative h-screen max-h-[1000px] min-h-[600px] overflow-hidden">
        {/* Background Image - Smooth Transition */}
        <div className="absolute inset-0 overflow-hidden">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${index === heroIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              style={{
                backgroundImage: `url(${image.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Subtle zoom animation for active image */}
              {index === heroIndex && (
                <div
                  className="absolute inset-0 w-full h-full animate-pulse-slow"
                  style={{
                    backgroundImage: `url(${image.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    animation: 'zoomInOut 20s ease-in-out infinite'
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Enhanced Overlay */}
        <div className="absolute inset-0 z-10">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/80" />
          {/* Light effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          {/* Subtle grain texture via CSS */}
          <div className="absolute inset-0 opacity-5 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")' }} />
        </div>

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto px-4"
          >

            {/* Main Title with Staggered Animation */}
            <motion.div className="overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.33, 1, 0.68, 1] }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight tracking-tight"
              >
                <motion.span
                  className="block text-white/90 font-normal mb-2 text-lg sm:text-xl md:text-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Selamat Datang di
                </motion.span>
                <motion.span
                  className="block bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.33, 1, 0.68, 1] }}
                >
                  Desa Baula
                </motion.span>
              </motion.h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div className="overflow-hidden">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-8 md:mb-12 text-white/90 font-medium leading-relaxed"
              >
                Portal informasi, layanan publik, dan transparansi pemerintahan Desa Baula.
                Kami berkomitmen memberikan pelayanan terbaik untuk masyarakat.
              </motion.p>
            </motion.div>

            {/* Action Buttons with Stagger */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1, delayChildren: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.a
                href="#berita"
                className="group relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <FaNewspaper className="relative z-10 text-lg group-hover:animate-pulse" />
                <span className="relative z-10">Lihat Berita Terkini</span>
              </motion.a>

              <motion.a
                href="#lokasi"
                className="group relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 shadow-xl hover:shadow-2xl backdrop-blur-sm transition-all duration-300 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <FaMapMarkerAlt className="relative z-10 text-lg group-hover:animate-bounce" />
                <span className="relative z-10">Lihat Lokasi Kantor</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Enhanced Carousel Controls */}
          {heroImages.length > 1 && (
            <>
              {/* Dots Indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      // Reset timer when manually changing
                      if (heroTimeout.current) {
                        clearTimeout(heroTimeout.current);
                      }
                      setHeroIndex(index);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ease-in-out hover:scale-125 focus:outline-none ${index === heroIndex
                        ? 'bg-white scale-125 shadow-[0_0_15px_3px_rgba(255,255,255,0.8)] animate-pulse'
                        : 'bg-white/50 hover:bg-white/70 hover:scale-110'
                      }`}
                    aria-label={`Gambar ${index + 1}`}
                  />
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => {
                  // Reset timer when manually changing
                  if (heroTimeout.current) {
                    clearTimeout(heroTimeout.current);
                  }
                  setHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
                }}
                className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-black/30 hover:bg-black/50 rounded-full backdrop-blur-sm transition-all duration-500 ease-in-out hover:scale-110 focus:outline-none group"
                aria-label="Gambar sebelumnya"
              >
                <FaChevronLeft className="text-white text-xl transition-transform duration-300 group-hover:-translate-x-1" />
              </button>

              <button
                onClick={() => {
                  // Reset timer when manually changing
                  if (heroTimeout.current) {
                    clearTimeout(heroTimeout.current);
                  }
                  setHeroIndex((prev) => (prev + 1) % heroImages.length);
                }}
                className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-black/30 hover:bg-black/50 rounded-full backdrop-blur-sm transition-all duration-500 ease-in-out hover:scale-110 focus:outline-none group"
                aria-label="Gambar berikutnya"
              >
                <FaChevronRight className="text-white text-xl transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              {/* Image Counter */}
              <div className="absolute top-6 right-6 z-30 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all duration-500 ease-in-out hover:bg-black/50 hover:scale-105">
                <span className="font-bold transition-all duration-300">{heroIndex + 1}</span>
                <span className="mx-1">/</span>
                <span className="transition-all duration-300">{heroImages.length}</span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Data Kependudukan Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-4"
            >
              <FaDatabase className="text-lg" />
              Data Kependudukan
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            >
              Statistik Kependudukan
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6 rounded-full"
            ></motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Data terbaru kependudukan Desa Baula
            </motion.p>
          </div>

          {/* Main Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              {
                icon: FaUsers,
                label: 'Total Penduduk',
                value: loading.penduduk ? '...' : totalPenduduk.toLocaleString('id-ID'),
                bgColor: 'bg-green-100',
                textColor: 'text-green-600',
                borderColor: 'border-green-200'
              },
              {
                icon: FaMale,
                label: 'Laki-laki',
                value: loading.penduduk ? '...' : (penduduk?.laki_laki || 0).toLocaleString('id-ID'),
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-600',
                borderColor: 'border-blue-200'
              },
              {
                icon: FaFemale,
                label: 'Perempuan',
                value: loading.penduduk ? '...' : (penduduk?.perempuan || 0).toLocaleString('id-ID'),
                bgColor: 'bg-pink-100',
                textColor: 'text-pink-600',
                borderColor: 'border-pink-200'
              },
              {
                icon: FaHome,
                label: 'Jumlah KK',
                value: loading.penduduk ? '...' : totalKK.toLocaleString('id-ID'),
                bgColor: 'bg-orange-100',
                textColor: 'text-orange-600',
                borderColor: 'border-orange-200'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className={`bg-white rounded-2xl p-6 text-center shadow-lg border ${stat.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.bgColor} rounded-2xl mb-4`}>
                  <stat.icon className={`text-3xl ${stat.textColor}`} />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              href="/data"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FaInfoCircle />
              Lihat Data Lengkap
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Sambutan Lurah - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-4"
              >
                <FaUserTie className="text-lg" />
                Sambutan Kepala Kelurahan
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4"
              >
                Sambutan Lurah
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6 rounded-full"
              ></motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-gray-600 max-w-2xl mx-auto"
              >
                Pesan dan komitmen kami untuk melayani masyarakat Desa Baula dengan sepenuh hati
              </motion.p>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="grid lg:grid-cols-3 gap-0">
                {/* Photo Section */}
                {lurah && (
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="lg:col-span-1 bg-gradient-to-br from-green-600 to-blue-700 p-8 lg:p-12 flex flex-col items-center justify-center text-center text-white relative overflow-hidden"
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
                    </div>

                    {/* Profile Photo */}
                    <div className="relative z-10">
                      <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl mx-auto bg-white/20 backdrop-blur-sm">
                        {lurah.foto ? (
                          <NextImage
                            width={224}
                            height={224}
                            src={lurah.foto}
                            alt={lurah.nama}
                            className="object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${lurah.foto ? 'hidden' : ''}`}>
                          <FaUser className="text-6xl text-gray-400" />
                        </div>
                      </div>

                      {/* Profile Info */}
                      <div className="mt-8">
                        <h3 className="text-2xl font-bold mb-2 tracking-wide">{lurah.nama}</h3>
                        <p className="text-green-100 text-lg font-medium mb-4">{lurah.jabatan}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Message Section */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="lg:col-span-2 p-8 lg:p-12 flex flex-col justify-center"
                >
                  <div className="max-w-2xl">
                    {/* Quote Icon */}
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl">
                        <FaQuoteLeft className="text-3xl text-green-600" />
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="space-y-6">
                      <blockquote className="text-xl md:text-2xl font-serif text-gray-800 leading-relaxed">
                        <p className="mb-6">
                          Assalamu&apos;alaikum Warrahmatullahi Wabarakatuh
                        </p>
                        <p className="mb-6">
                          Selamat datang di website resmi Desa Baula. Sebagai Kepala Kelurahan, saya mengucapkan terima kasih atas kepercayaan masyarakat yang telah diberikan kepada kami dalam mengelola pemerintahan di tingkat kelurahan.
                        </p>
                        <p className="mb-6">
                          Kami berkomitmen untuk memberikan pelayanan terbaik bagi masyarakat melalui transparansi informasi, layanan publik yang mudah diakses, dan program-program yang berorientasi pada peningkatan kesejahteraan masyarakat.
                        </p>
                        <p className="mb-6">
                          Mari bersama-sama membangun Baula yang lebih maju, sejahtera, dan berdaya saing melalui kolaborasi yang harmonis antara pemerintah dan masyarakat.
                        </p>
                        <p>
                          Wassalamu&apos;alaikum Warrahmatullahi Wabarakatuh
                        </p>
                      </blockquote>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-4"
              >
                <FaUsers className="text-lg" />
                Tim Pengelola
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
              >
                Struktur Organisasi
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6 rounded-full"
              ></motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-gray-600 max-w-2xl mx-auto"
              >
                Tim pengelola Desa Baula yang siap melayani masyarakat dengan profesional dan berdedikasi
              </motion.p>
            </div>

            {/* Loading State */}
            {loading.struktur ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center py-12"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
                  <p className="text-gray-600">Memuat struktur organisasi...</p>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Main Content with ScrollNavigator */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <ScrollNavigator>
                    {strukturList.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className="flex-shrink-0 w-72 lg:w-80 snap-start"
                      >
                        <CardStruktur
                          nama={item.nama}
                          jabatan={item.jabatan}
                          foto={item.foto}
                        />
                      </motion.div>
                    ))}
                  </ScrollNavigator>

                  {/* Empty State */}
                  {strukturList.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-center py-12"
                    >
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                        <FaUsers className="text-3xl text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum Ada Data</h3>
                      <p className="text-gray-600">Data struktur organisasi belum tersedia</p>
                    </motion.div>
                  )}
                </motion.div>

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-center mt-12"
                >
                  <Link
                    href="/profil"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FaInfoCircle />
                    Lihat Profil Lengkap
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Berita Terbaru - Enhanced */}
      <section id="berita" className="py-20 bg-gradient-to-br from-white via-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-4"
              >
                <FaNewspaper className="text-lg" />
                Informasi Terkini
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
              >
                Berita Terkini
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6 rounded-full"
              ></motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-gray-600 max-w-2xl mx-auto"
              >
                Update informasi dan kegiatan terbaru dari Desa Baula untuk masyarakat
              </motion.p>
            </div>

            {/* Loading State */}
            {loading.berita ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center py-12"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
                  <p className="text-gray-600">Memuat berita terkini...</p>
                </div>
              </motion.div>
            ) : (
              <>

                {/* Main Content with ScrollNavigator */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <ScrollNavigator>
                    {beritaList.slice(0, 12).map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className="flex-shrink-0 w-72 lg:w-80 snap-start"
                      >
                        <CardBerita
                          id={item.id}
                          slug={item.slug}
                          gambar={item.gambar}
                          judul={item.judul}
                          tanggal={item.tanggal}
                          sumber={item.sumber}
                          isi={item.isi}
                        />
                      </motion.div>
                    ))}
                  </ScrollNavigator>

                  {/* Empty State */}
                  {beritaList.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-center py-12"
                    >
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                        <FaNewspaper className="text-3xl text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum Ada Berita</h3>
                      <p className="text-gray-600">Berita terkini belum tersedia</p>
                    </motion.div>
                  )}
                </motion.div>

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-center mt-12"
                >
                  <Link
                    href="/berita"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FaArrowRight />
                    Lihat Semua Berita
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Galeri Kegiatan - Enhanced */}
      <section id="galeri" className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-4"
              >
                <FaImage className="text-lg" />
                Dokumentasi Kegiatan
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
              >
                Galeri Kegiatan
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-6 rounded-full"
              ></motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-gray-600 max-w-2xl mx-auto"
              >
                Dokumentasi kegiatan terbaru dan momen berharga dari Desa Baula
              </motion.p>
            </div>

            {/* Loading State */}
            {loading.galeri ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center py-12"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600">Memuat galeri kegiatan...</p>
                </div>
              </motion.div>
            ) : (
              <>

                {/* Main Content with ScrollNavigator */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <ScrollNavigator>
                    {galeriList.slice(0, 12).map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className="flex-shrink-0 w-64 lg:w-72 snap-start"
                      >
                        <div
                          className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 aspect-square cursor-pointer group"
                          onClick={() => setSelectedImage({ index, url: item.url, title: item.judul })}
                        >
                          <NextImage
                            src={item.url}
                            alt={item.judul || 'Kegiatan Desa Baula'}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          {/* Image Info Overlay */}
                          {item.judul && (
                            <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 w-full">
                                <p className="text-gray-800 text-sm font-medium line-clamp-2">{item.judul}</p>
                              </div>
                            </div>
                          )}

                          {/* Click Indicator */}
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <FaExpand className="text-gray-600 text-sm" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </ScrollNavigator>

                  {/* Empty State */}
                  {galeriList.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-center py-12"
                    >
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                        <FaImage className="text-3xl text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum Ada Foto</h3>
                      <p className="text-gray-600">Galeri kegiatan belum tersedia</p>
                    </motion.div>
                  )}
                </motion.div>

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-center mt-12"
                >
                  <Link
                    href="/galeri"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FaArrowRight />
                    Lihat Galeri Lengkap
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Enhanced Image Preview Modal */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedImage(null);
              }
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white hover:text-blue-400 transition-colors z-10 bg-black/50 rounded-full p-3 backdrop-blur-sm"
              aria-label="Tutup preview"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={() => {
                const newIndex = selectedImage.index > 0 ? selectedImage.index - 1 : galeriList.length - 1;
                setSelectedImage({
                  index: newIndex,
                  url: galeriList[newIndex].url,
                  title: galeriList[newIndex].judul
                });
              }}
              className="absolute left-6 text-white hover:text-blue-400 transition-colors z-10 bg-black/50 rounded-full p-3 backdrop-blur-sm"
              aria-label="Gambar sebelumnya"
            >
              <FaChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => {
                const newIndex = selectedImage.index < galeriList.length - 1 ? selectedImage.index + 1 : 0;
                setSelectedImage({
                  index: newIndex,
                  url: galeriList[newIndex].url,
                  title: galeriList[newIndex].judul
                });
              }}
              className="absolute right-6 text-white hover:text-blue-400 transition-colors z-10 bg-black/50 rounded-full p-3 backdrop-blur-sm"
              aria-label="Gambar berikutnya"
            >
              <FaChevronRight className="w-6 h-6" />
            </button>

            {/* Image Container */}
            <div className="max-w-6xl w-full max-h-[90vh] flex flex-col">
              <div className="relative flex-1 flex items-center justify-center">
                <NextImage
                  width={1200}
                  height={800}
                  src={selectedImage.url}
                  alt={selectedImage.title || 'Preview Galeri'}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>

              {/* Image Info */}
              {selectedImage.title && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-center"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 inline-block">
                    <p className="text-white font-medium text-lg">{selectedImage.title}</p>
                    <p className="text-white/80 text-sm mt-1">
                      {selectedImage.index + 1} dari {galeriList.length}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </section>

      {/* Lokasi Kantor - Enhanced */}
      <section id="lokasi" className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-4"
              >
                <FaMapMarkerAlt className="text-lg" />
                Lokasi
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
              >
                Lokasi Kantor
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6 rounded-full"
              ></motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-gray-600 max-w-2xl mx-auto"
              >
                Temukan lokasi kantor Desa Baula dan hubungi kami untuk informasi lebih lanjut
              </motion.p>
            </div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Map Section */}
                <div className="lg:w-1/2 h-80 lg:h-96 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-blue-600/10 z-10 pointer-events-none"></div>
                  <iframe
                    title="Peta Kantor Desa Baula"
                    src="https://maps.google.com/maps?q=Kantor%20Desa%20Baula,%20Tellu%20Limpoe,%20Sidrap&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    className="relative z-0"
                  ></iframe>

                  {/* Map Overlay Info */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-green-600 text-sm" />
                        <span className="text-sm font-medium text-gray-800">Kantor Kelurahan</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-green-50 to-blue-50">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-2 rounded-xl">
                        <FaMapMarkerAlt className="text-lg" />
                      </div>
                      Informasi Lokasi
                    </h3>

                    <div className="space-y-6">
                      {/* Address */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="flex items-start gap-4 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 hover:bg-white/90 transition-all duration-300"
                      >
                        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-xl flex-shrink-0">
                          <FaMapMarkerAlt className="text-lg" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">Alamat Kantor</h4>
                          <p className="text-gray-600 leading-relaxed">
                            Desa Baula, Kec. Tellu Limpoe, Kab. Sidenreng Rappang (Sidrap), Sulawesi Selatan 91661
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.9 }}
                      className="mt-8 flex justify-center"
                    >
                      <a
                        href="https://maps.app.goo.gl/hAsbEuUTYGrTfEW37"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <FaMapMarkerAlt />
                        Buka di Maps
                      </a>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  )
}