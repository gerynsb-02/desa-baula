import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { 
  FaUserCheck, FaClipboardList, FaFileAlt, FaStamp, FaCheckCircle, 
  FaUser, FaHome, FaSuitcase, FaHeart, FaBuilding, FaUsers, 
  FaBaby, FaSkull, FaRing, FaIdCard, FaAddressCard, FaMusic,
  FaPhone, FaWhatsapp, FaEnvelope, FaClock, FaInfoCircle,
  FaArrowRight, FaFileDownload, FaMapMarkerAlt, FaCalendarAlt,
  FaShieldAlt, FaHandshake, FaCertificate, FaClipboardCheck,
  FaLandmark, FaBullseye, FaMountain, FaUtensils
} from 'react-icons/fa';

// ─── Color map ────────────────────────────────────────────────────────────────
const COLOR_MAP = {
  red:     { bg: 'bg-red-100',     text: 'text-red-600',     border: 'border-red-200',     light: 'bg-red-50',     dark: 'text-red-700' },
  blue:    { bg: 'bg-blue-100',    text: 'text-blue-600',    border: 'border-blue-200',    light: 'bg-blue-50',    dark: 'text-blue-700' },
  green:   { bg: 'bg-green-100',   text: 'text-green-600',   border: 'border-green-200',   light: 'bg-green-50',   dark: 'text-green-700' },
  yellow:  { bg: 'bg-yellow-100',  text: 'text-yellow-600',  border: 'border-yellow-200',  light: 'bg-yellow-50',  dark: 'text-yellow-700' },
  purple:  { bg: 'bg-purple-100',  text: 'text-purple-600',  border: 'border-purple-200',  light: 'bg-purple-50',  dark: 'text-purple-700' },
  pink:    { bg: 'bg-pink-100',    text: 'text-pink-600',    border: 'border-pink-200',    light: 'bg-pink-50',    dark: 'text-pink-700' },
  indigo:  { bg: 'bg-indigo-100',  text: 'text-indigo-600',  border: 'border-indigo-200',  light: 'bg-indigo-50',  dark: 'text-indigo-700' },
  orange:  { bg: 'bg-orange-100',  text: 'text-orange-600',  border: 'border-orange-200',  light: 'bg-orange-50',  dark: 'text-orange-700' },
  teal:    { bg: 'bg-teal-100',    text: 'text-teal-600',    border: 'border-teal-200',    light: 'bg-teal-50',    dark: 'text-teal-700' },
  cyan:    { bg: 'bg-cyan-100',    text: 'text-cyan-600',    border: 'border-cyan-200',    light: 'bg-cyan-50',    dark: 'text-cyan-700' },
  rose:    { bg: 'bg-rose-100',    text: 'text-rose-600',    border: 'border-rose-200',    light: 'bg-rose-50',    dark: 'text-rose-700' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200', light: 'bg-emerald-50', dark: 'text-emerald-700' },
  gray:    { bg: 'bg-gray-100',    text: 'text-gray-600',    border: 'border-gray-200',    light: 'bg-gray-50',    dark: 'text-gray-700' }
}
const getColor = (c) => COLOR_MAP[c] || COLOR_MAP.blue

// ─── Default Data ─────────────────────────────────────────────────────────────
const DEFAULT_DATA = {
  alurPelayanan: [
    { title: 'Pemohon', description: 'Warga datang ke kelurahan', color: 'green' },
    { title: 'Meja Pelayanan', description: 'Mengisi formulir permohonan', color: 'blue' },
    { title: 'Pemeriksaan Berkas', description: 'Petugas memeriksa kelengkapan dokumen', color: 'yellow' },
    { title: 'Input Data', description: 'Petugas memproses dan mencetak dokumen', color: 'purple' },
    { title: 'Pengesahan', description: 'Penandatanganan oleh lurah', color: 'pink' },
    { title: 'Penyerahan', description: 'Dokumen diberikan ke pemohon', color: 'green' }
  ],
  jenisPelayanan: [
    { title: 'Surat Keterangan Tidak Mampu', description: 'Pengajuan surat keterangan tidak mampu untuk keperluan administrasi.', requirements: ['Fotocopy KK', 'Fotocopy KTP', 'Surat pengantar RT/RW'], color: 'red' },
    { title: 'Surat Keterangan Domisili', description: 'Pengajuan surat keterangan domisili untuk keperluan administrasi.', requirements: ['Fotocopy KK', 'Fotocopy KTP', 'Surat pengantar RT/RW'], color: 'blue' },
    { title: 'Surat Keterangan Bepergian', description: 'Pengajuan surat keterangan bepergian untuk keperluan perjalanan.', requirements: ['Fotocopy KK', 'Fotocopy KTP', 'Surat pengantar RT/RW'], color: 'green' },
    { title: 'Surat Keterangan Belum Pernah Menikah', description: 'Pengajuan surat keterangan belum pernah menikah untuk keperluan administrasi.', requirements: ['Fotocopy KK', 'Fotocopy KTP', 'Surat pengantar RT/RW'], color: 'pink' },
    { title: 'Surat Keterangan Usaha', description: 'Pengajuan surat keterangan usaha untuk keperluan legalitas usaha.', requirements: ['Fotocopy KK', 'Fotocopy KTP', 'Surat pengantar RT/RW', 'Foto lokasi usaha'], color: 'purple' },
    { title: 'Surat Keterangan Ahli Waris', description: 'Pengajuan surat keterangan ahli waris untuk keperluan administrasi warisan.', requirements: ['Fotocopy KK', 'Fotocopy KTP almarhum', 'Fotocopy KTP ahli waris', 'Surat pengantar RT/RW'], color: 'indigo' },
    { title: 'Surat Keterangan Kelahiran', description: 'Pengajuan surat keterangan kelahiran untuk keperluan administrasi kependudukan.', requirements: ['Fotocopy KK', 'Surat keterangan lahir dari bidan/rumah sakit', 'Surat pengantar RT/RW'], color: 'yellow' },
    { title: 'Surat Pengantar Pernikahan', description: 'Pengajuan surat pengantar pernikahan untuk keperluan administrasi pernikahan.', requirements: ['Fotocopy KK', 'Fotocopy KTP', 'Surat pengantar RT/RW', 'Surat keterangan belum menikah'], color: 'rose' },
    { title: 'Surat Pengantar E-KTP', description: 'Pengajuan surat pengantar E-KTP untuk keperluan pembuatan atau pembaruan E-KTP.', requirements: ['Fotocopy KK', 'Surat pengantar RT/RW', 'Fotocopy KTP lama (jika perpanjangan)'], color: 'cyan' },
    { title: 'Surat Pengantar Kartu Keluarga', description: 'Pengajuan surat pengantar Kartu Keluarga untuk keperluan pembuatan atau pembaruan KK.', requirements: ['Fotocopy KK lama', 'Surat pengantar RT/RW', 'Dokumen pendukung perubahan'], color: 'orange' },
    { title: 'Surat Izin Keramaian', description: 'Pengajuan surat izin keramaian untuk keperluan penyelenggaraan acara.', requirements: ['Fotocopy KTP', 'Surat pengantar RT/RW', 'Proposal acara', 'Denah lokasi acara'], color: 'emerald' }
  ],
  jamPelayanan: [
    { day: 'Senin - Kamis', hours: '07:30 - 12:00 WITA', breakTime: 'Istirahat 12:00 - 13:00', afternoon: '13:00 - 16:00 WITA', isLibur: false },
    { day: 'Jumat', hours: '07:30 - 11:00 WITA', breakTime: 'Istirahat 11:00 - 14:00', afternoon: '14:00 - 16:30 WITA', isLibur: false },
    { day: 'Sabtu - Minggu', hours: '', breakTime: '', afternoon: '', isLibur: true }
  ]
}

// ─── Service Flow Component ───────────────────────────────────────────────────
const ServiceFlow = ({ steps }) => (
  <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
    <div className="text-center mb-6 sm:mb-8 lg:mb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
        <FaClipboardList className="text-sm sm:text-lg" />
        <span className="hidden sm:inline">Alur Pelayanan</span>
        <span className="sm:hidden">Alur</span>
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
        className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3">
        <FaClipboardList className="text-2xl sm:text-3xl lg:text-4xl" />
        <span className="hidden sm:inline">Alur Pelayanan</span>
        <span className="sm:hidden">Alur</span>
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
        className="text-gray-600 text-xs sm:text-sm lg:text-base max-w-3xl mx-auto">
        Proses pelayanan yang transparan dan terstruktur untuk memastikan pelayanan yang cepat dan berkualitas
      </motion.p>
    </div>

    <div className="relative">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="flex items-start justify-between">
          {steps.map((step, index) => {
            const c = getColor(step.color)
            return (
              <div key={index} className="flex flex-col items-center flex-1 relative">
                <div className={`w-16 h-16 rounded-full ${c.bg} border-4 border-white shadow-lg flex items-center justify-center mb-4 hover:shadow-xl transition-shadow duration-300`}>
                  <span className={`${c.text} font-bold text-lg`}>{index + 1}</span>
                </div>
                <div className={`${c.light} ${c.border} border-2 rounded-lg p-3 text-center w-full h-20 flex flex-col justify-center`}>
                  <h3 className={`text-sm font-bold ${c.dark} mb-1`}>{step.title}</h3>
                  <p className="text-xs text-gray-600 leading-tight">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-full transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gray-300 h-1 w-20 rounded-full"></div>
                    <FaArrowRight className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Tablet 3x2 grid */}
      <div className="hidden md:block lg:hidden">
        <div className="grid grid-cols-3 gap-4">
          {steps.map((step, index) => {
            const c = getColor(step.color)
            return (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full ${c.bg} border-4 border-white shadow-lg flex items-center justify-center mb-3 hover:shadow-xl transition-shadow`}>
                  <span className={`${c.text} font-bold`}>{index + 1}</span>
                </div>
                <div className={`${c.light} ${c.border} border-2 rounded-lg p-3 text-center w-full h-16 flex flex-col justify-center`}>
                  <h3 className={`text-sm font-bold ${c.dark} mb-1`}>{step.title}</h3>
                  <p className="text-xs text-gray-600 leading-tight">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile vertical */}
      <div className="md:hidden space-y-3">
        {steps.map((step, index) => {
          const c = getColor(step.color)
          return (
            <div key={index} className="flex items-start">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${c.bg} border-2 sm:border-4 border-white shadow-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0`}>
                <span className={`${c.text} font-bold text-sm`}>{index + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className={`text-xs sm:text-sm font-bold ${c.dark} mb-1`}>{step.title}</h3>
                <p className="text-xs text-gray-600 leading-tight">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </div>
)

// ─── Service Card ─────────────────────────────────────────────────────────────
const ServiceCard = ({ service, index }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const c = getColor(service.color)
  return (
    <motion.div
      className="border border-gray-200 rounded-2xl p-3 sm:p-4 lg:p-6 hover:shadow-xl transition-all duration-300 bg-white hover:border-gray-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-white"
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="flex items-start">
        <div className={`${c.bg} ${c.text} p-2 sm:p-3 lg:p-4 rounded-xl mr-3 sm:mr-4 flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300 text-xl`}>
          📄
        </div>
        <div className="flex-1">
          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 mb-2 sm:mb-3">{service.title}</h3>
          <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-2 sm:mb-3 leading-relaxed">{service.description}</p>
          <button onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs sm:text-sm lg:text-base text-green-600 font-medium flex items-center hover:text-green-700 transition-colors">
            {isExpanded ? 'Sembunyikan' : 'Lihat'} persyaratan
            <FaArrowRight className={`ml-1 sm:ml-2 transition-transform duration-200 ${isExpanded ? 'transform rotate-90' : ''}`} />
          </button>
          {isExpanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }} className="mt-3 sm:mt-4 lg:mt-6">
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 lg:p-6">
                <h4 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-700 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1 sm:gap-2">
                  <FaClipboardCheck className="text-green-600" /> Persyaratan:
                </h4>
                <ul className="space-y-1 sm:space-y-2 lg:space-y-3">
                  {(service.requirements || []).map((req, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2 sm:mr-3 mt-0.5 sm:mt-1 flex-shrink-0">•</span>
                      <span className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Service Hours ────────────────────────────────────────────────────────────
const ServiceHours = ({ hours }) => (
  <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-blue-100">
    <div className="text-center mb-6 sm:mb-8 lg:mb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
        <FaClock className="text-sm sm:text-lg" />
        <span className="hidden sm:inline">Jam Pelayanan</span>
        <span className="sm:hidden">Jam</span>
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
        className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3">
        <FaClock className="text-2xl sm:text-3xl lg:text-4xl" />
        <span className="hidden sm:inline">Jam Pelayanan</span>
        <span className="sm:hidden">Jam</span>
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
        className="text-gray-600 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto">
        Pelayanan tersedia sesuai jadwal yang telah ditentukan untuk memastikan kualitas layanan yang optimal
      </motion.p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {hours.map((hour, index) => (
        <motion.div key={index}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`border border-gray-200 rounded-2xl p-4 sm:p-6 lg:p-8 bg-white flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 ${hour.isLibur ? 'border-gray-200 bg-gray-50' : ''}`}>
          <div className={`${hour.isLibur ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'} p-2 sm:p-3 lg:p-4 rounded-full mb-3 sm:mb-4 lg:mb-6 text-xl sm:text-2xl`}>
            <FaCalendarAlt />
          </div>
          <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 lg:mb-6">{hour.day}</h3>
          {hour.isLibur ? (
            <p className="text-red-500 font-medium text-sm sm:text-lg">Libur</p>
          ) : (
            <div className="text-center space-y-1 sm:space-y-2 lg:space-y-3">
              {hour.hours && <p className="text-gray-700 font-medium text-sm sm:text-base lg:text-lg">{hour.hours}</p>}
              {hour.breakTime && <p className="text-gray-500 text-xs sm:text-sm lg:text-base">{hour.breakTime}</p>}
              {hour.afternoon && <p className="text-gray-700 font-medium text-sm sm:text-base lg:text-lg">{hour.afternoon}</p>}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Layanan() {
  const [layananData, setLayananData] = useState(DEFAULT_DATA)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const fetchLayanan = async () => {
      try {
        const snap = await getDoc(doc(db, 'layanan', 'konten'))
        if (snap.exists()) {
          const data = snap.data()
          setLayananData({
            alurPelayanan: data.alurPelayanan?.length ? data.alurPelayanan : DEFAULT_DATA.alurPelayanan,
            jenisPelayanan: data.jenisPelayanan?.length ? data.jenisPelayanan : DEFAULT_DATA.jenisPelayanan,
            jamPelayanan: data.jamPelayanan?.length ? data.jamPelayanan : DEFAULT_DATA.jamPelayanan
          })
        }
      } catch (err) {
        console.error('Error fetching layanan data:', err)
      } finally {
        setLoadingData(false)
      }
    }
    fetchLayanan()
  }, [])

  return (
    <div className='pt-15'>
    <Layout title="Layanan Publik">
      <Head>
        <meta name="description" content="Layanan publik Kelurahan Baula - Pengajuan surat menyurat dan administrasi kependudukan" />
        <meta name="keywords" content="layanan publik, surat keterangan, administrasi, kelurahan Baula" />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-8 sm:py-12 lg:py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <FaUserCheck className="text-sm sm:text-lg" />
            <span className="hidden sm:inline">Layanan Publik</span>
            <span className="sm:hidden">Layanan</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            <span className="hidden sm:inline">Layanan Publik Kelurahan Baula</span>
            <span className="sm:hidden">Layanan Publik</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-lg lg:text-xl text-green-100 max-w-3xl mx-auto">
            Informasi dan pengajuan layanan administrasi Kelurahan Baula
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-16 space-y-8 sm:space-y-12 lg:space-y-16">
        {/* Loading skeleton */}
        {loadingData ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Service Flow */}
            <ServiceFlow steps={layananData.alurPelayanan} />

            {/* Jenis Pelayanan */}
            <section>
              <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-green-100">
                <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                    <FaFileAlt className="text-sm sm:text-lg" />
                    <span className="hidden sm:inline">Jenis Pelayanan</span>
                    <span className="sm:hidden">Layanan</span>
                  </motion.div>
                  <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3">
                    <FaFileAlt className="text-2xl sm:text-3xl lg:text-4xl" />
                    <span className="hidden sm:inline">Jenis Pelayanan</span>
                    <span className="sm:hidden">Layanan</span>
                  </motion.h2>
                  <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-gray-600 text-xs sm:text-sm lg:text-base max-w-3xl mx-auto">
                    Berbagai jenis layanan administrasi yang tersedia untuk memenuhi kebutuhan warga Kelurahan Baula
                  </motion.p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {layananData.jenisPelayanan.map((service, index) => (
                    <ServiceCard key={index} service={service} index={index} />
                  ))}
                </div>
              </div>
            </section>

            {/* Jam Pelayanan */}
            <ServiceHours hours={layananData.jamPelayanan} />
          </>
        )}
      </div>
    </Layout>
    </div>
  )
}