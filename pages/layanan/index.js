import React from 'react';
import Layout from '../../components/Layout'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { 
  FaUserCheck, FaClipboardList, FaFileAlt, FaStamp, FaCheckCircle, 
  FaUser, FaHome, FaSuitcase, FaHeart, FaBuilding, FaUsers, 
  FaBaby, FaSkull, FaRing, FaIdCard, FaAddressCard, FaMusic,
  FaPhone, FaWhatsapp, FaEnvelope, FaClock, FaInfoCircle,
  FaArrowRight, FaFileDownload, FaMapMarkerAlt, FaCalendarAlt,
  FaShieldAlt, FaHandshake, FaCertificate, FaClipboardCheck
} from 'react-icons/fa';

const services = [
  {
    title: "Surat Keterangan Tidak Mampu",
    description: "Pengajuan surat keterangan tidak mampu untuk keperluan administrasi.",
    requirements: ["Fotocopy KK", "Fotocopy KTP", "Surat pengantar RT/RW"],
    icon: <FaShieldAlt size={24} />,
    color: "bg-red-100 text-red-600"
  },
  {
    title: "Surat Keterangan Domisili",
    description: "Pengajuan surat keterangan domisili untuk keperluan administrasi.",
    requirements: ["Fotocopy KK", "Fotocopy KTP", "Surat pengantar RT/RW"],
    icon: <FaMapMarkerAlt size={24} />,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Surat Keterangan Bepergian",
    description: "Pengajuan surat keterangan bepergian untuk keperluan perjalanan.",
    requirements: ["Fotocopy KK", "Fotocopy KTP", "Surat pengantar RT/RW"],
    icon: <FaSuitcase size={24} />,
    color: "bg-green-100 text-green-600"
  },
  {
    title: "Surat Keterangan Belum Pernah Menikah",
    description: "Pengajuan surat keterangan belum pernah menikah untuk keperluan administrasi.",
    requirements: ["Fotocopy KK", "Fotocopy KTP", "Surat pengantar RT/RW"],
    icon: <FaHeart size={24} />,
    color: "bg-pink-100 text-pink-600"
  },
  {
    title: "Surat Keterangan Usaha",
    description: "Pengajuan surat keterangan usaha untuk keperluan legalitas usaha.",
    requirements: ["Fotocopy KK", "Fotocopy KTP", "Surat pengantar RT/RW", "Foto lokasi usaha"],
    icon: <FaBuilding size={24} />,
    color: "bg-purple-100 text-purple-600"
  },
  {
    title: "Surat Keterangan Ahli Waris",
    description: "Pengajuan surat keterangan ahli waris untuk keperluan administrasi warisan.",
    requirements: ["Fotocopy KK", "Fotocopy KTP almarhum", "Fotocopy KTP ahli waris", "Surat pengantar RT/RW"],
    icon: <FaUsers size={24} />,
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    title: "Surat Keterangan Kelahiran",
    description: "Pengajuan surat keterangan kelahiran untuk keperluan administrasi kependudukan.",
    requirements: ["Fotocopy KK", "Surat keterangan lahir dari bidan/rumah sakit", "Surat pengantar RT/RW"],
    icon: <FaBaby size={24} />,
    color: "bg-yellow-100 text-yellow-600"
  },
  {
    title: "Surat Keterangan Kematian",
    description: "Pengajuan surat kematian untuk keperluan administrasi kependudukan.",
    requirements: ["Fotocopy KK", "Fotocopy KTP almarhum", "Surat keterangan kematian dari RT/RW"],
    icon: <FaSkull size={24} />,
    color: "bg-gray-100 text-gray-600"
  },
  {
    title: "Surat Kelahiran",
    description: "Pengajuan surat kelahiran untuk keperluan administrasi kependudukan.",
    requirements: ["Fotocopy KK", "Akte kelahiran dari rumah sakit/bidan", "Surat nikah orang tua", "Surat pengantar RT/RW"],
    icon: <FaBaby size={24} />,
    color: "bg-teal-100 text-teal-600"
  },
  {
    title: "Surat Kematian",
    description: "Pengajuan surat kematian untuk keperluan administrasi kependudukan.",
    requirements: ["Fotocopy KK", "Fotocopy KTP almarhum", "Surat keterangan kematian dari RT/RW", "Surat keterangan dari rumah sakit (jika ada)"],
    icon: <FaSkull size={24} />,
    color: "bg-gray-100 text-gray-600"
  },
  {
    title: "Surat Pengantar Pernikahan",
    description: "Pengajuan surat pengantar pernikahan untuk keperluan administrasi pernikahan.",
    requirements: ["Fotocopy KK", "Fotocopy KTP", "Surat pengantar RT/RW", "Surat keterangan belum menikah"],
    icon: <FaRing size={24} />,
    color: "bg-rose-100 text-rose-600"
  },
  {
    title: "Surat Pengantar E-KTP",
    description: "Pengajuan surat pengantar E-KTP untuk keperluan pembuatan atau pembaruan E-KTP.",
    requirements: ["Fotocopy KK", "Surat pengantar RT/RW", "Fotocopy KTP lama (jika perpanjangan)"],
    icon: <FaIdCard size={24} />,
    color: "bg-cyan-100 text-cyan-600"
  },
  {
    title: "Surat Pengantar Kartu Keluarga",
    description: "Pengajuan surat pengantar Kartu Keluarga untuk keperluan pembuatan atau pembaruan KK.",
    requirements: ["Fotocopy KK lama", "Surat pengantar RT/RW", "Dokumen pendukung perubahan (akta nikah, akta cerai, dll)"],
    icon: <FaAddressCard size={24} />,
    color: "bg-orange-100 text-orange-600"
  },
  {
    title: "Surat Izin Keramaian",
    description: "Pengajuan surat izin keramaian untuk keperluan penyelenggaraan acara.",
    requirements: ["Fotocopy KTP", "Surat pengantar RT/RW", "Proposal acara", "Denah lokasi acara"],
    icon: <FaMusic size={24} />,
    color: "bg-emerald-100 text-emerald-600"
  }
]

const serviceHours = [
  {
    day: "Senin - Kamis",
    hours: "07:30 - 12:00 WITA",
    break: "Istirahat 12:00 - 13:00",
    afternoon: "13:00 - 16:00 WITA",
    icon: <FaCalendarAlt />,
    color: "bg-green-100 text-green-600"
  },
  {
    day: "Jumat",
    hours: "07:30 - 11:00 WITA",
    break: "Istirahat 11:00 - 14:00",
    afternoon: "14:00 - 16:30 WITA",
    icon: <FaCalendarAlt />,
    color: "bg-blue-100 text-blue-600"
  },
  {
    day: "Sabtu - Minggu",
    hours: "Libur",
    break: "",
    afternoon: "",
    icon: <FaCalendarAlt />,
    color: "bg-gray-100 text-gray-600"
  }
]

const ServiceFlow = () => {
  const steps = [
    { 
      icon: <FaUser className="text-green-600" />, 
      title: "Pemohon", 
      description: "Warga datang ke kelurahan", 
      color: "bg-green-100",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700"
    },
    { 
      icon: <FaClipboardList className="text-blue-600" />, 
      title: "Meja Pelayanan", 
      description: "Mengisi formulir permohonan", 
      color: "bg-blue-100",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700"
    },
    { 
      icon: <FaFileAlt className="text-yellow-600" />, 
      title: "Pemeriksaan Berkas", 
      description: "Petugas memeriksa kelengkapan dokumen", 
      color: "bg-yellow-100",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-700"
    },
    { 
      icon: <FaClipboardCheck className="text-purple-600" />, 
      title: "Input Data", 
      description: "Petugas memproses dan mencetak dokumen", 
      color: "bg-purple-100",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700"
    },
    { 
      icon: <FaStamp className="text-pink-600" />, 
      title: "Pengesahan", 
      description: "Penandatanganan oleh lurah", 
      color: "bg-pink-100",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      textColor: "text-pink-700"
    },
    { 
      icon: <FaHandshake className="text-green-700" />, 
      title: "Penyerahan", 
      description: "Dokumen diberikan ke pemohon", 
      color: "bg-green-100",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
      <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4"
        >
          <FaClipboardList className="text-sm sm:text-lg" />
          <span className="hidden sm:inline">Alur Pelayanan</span>
          <span className="sm:hidden">Alur</span>
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3"
        >
          <FaClipboardList className="text-2xl sm:text-3xl lg:text-4xl" />
          <span className="hidden sm:inline">Alur Pelayanan</span>
          <span className="sm:hidden">Alur</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-600 text-xs sm:text-sm lg:text-base max-w-3xl mx-auto"
        >
          Proses pelayanan yang transparan dan terstruktur untuk memastikan pelayanan yang cepat dan berkualitas
        </motion.p>
      </div>
      
      <div className="relative">
        {/* Desktop version - Perfect horizontal alignment */}
        <div className="hidden lg:block">
          <div className="flex items-start justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1 relative">
                <div className={`w-16 h-16 rounded-full ${step.color} border-4 border-white shadow-lg flex items-center justify-center mb-4 hover:shadow-xl transition-shadow duration-300`}>
                  {step.icon}
                </div>
                <div className={`${step.bgColor} ${step.borderColor} border-2 rounded-lg p-3 text-center w-full h-20 flex flex-col justify-center`}>
                  <h3 className={`text-sm font-bold ${step.textColor} mb-1`}>{step.title}</h3>
                  <p className="text-xs text-gray-600 leading-tight">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-full transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gray-300 h-1 w-20 rounded-full"></div>
                    <FaArrowRight className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Tablet version - 3x2 grid */}
        <div className="hidden md:block lg:hidden">
          <div className="grid grid-cols-3 gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full ${step.color} border-4 border-white shadow-lg flex items-center justify-center mb-3 hover:shadow-xl transition-shadow duration-300`}>
                  {step.icon}
                </div>
                <div className={`${step.bgColor} ${step.borderColor} border-2 rounded-lg p-3 text-center w-full h-16 flex flex-col justify-center`}>
                  <h3 className={`text-sm font-bold ${step.textColor} mb-1`}>{step.title}</h3>
                  <p className="text-xs text-gray-600 leading-tight">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile version - Vertical list */}
        <div className="md:hidden space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${step.color} border-2 sm:border-4 border-white shadow-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 hover:shadow-xl transition-shadow duration-300`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <h3 className={`text-xs sm:text-sm font-bold ${step.textColor} mb-1`}>{step.title}</h3>
                <p className="text-xs text-gray-600 leading-tight">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ service, index }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div 
      className="border border-gray-200 rounded-2xl p-3 sm:p-4 lg:p-6 hover:shadow-xl transition-all duration-300 bg-white hover:border-gray-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-white"
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex items-start">
        <div className={`${service.color} p-2 sm:p-3 lg:p-4 rounded-xl mr-3 sm:mr-4 flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
          {service.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 mb-2 sm:mb-3">{service.title}</h3>
          <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-2 sm:mb-3 leading-relaxed">{service.description}</p>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs sm:text-sm lg:text-base text-green-600 font-medium flex items-center hover:text-green-700 transition-colors"
          >
            {isExpanded ? 'Sembunyikan' : 'Lihat'} persyaratan
            <FaArrowRight className={`ml-1 sm:ml-2 transition-transform duration-200 ${isExpanded ? 'transform rotate-90' : ''}`} />
          </button>
          
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 sm:mt-4 lg:mt-6"
            >
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 lg:p-6">
                <h4 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-700 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1 sm:gap-2">
                  <FaClipboardCheck className="text-green-600" />
                  Persyaratan:
                </h4>
                <ul className="space-y-1 sm:space-y-2 lg:space-y-3">
                  {service.requirements.map((req, i) => (
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
  );
};

const ServiceHours = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-blue-100">
      <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4"
        >
          <FaClock className="text-sm sm:text-lg" />
          <span className="hidden sm:inline">Jam Pelayanan</span>
          <span className="sm:hidden">Jam</span>
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3"
        >
          <FaClock className="text-2xl sm:text-3xl lg:text-4xl" />
          <span className="hidden sm:inline">Jam Pelayanan</span>
          <span className="sm:hidden">Jam</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-600 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto"
        >
          Pelayanan tersedia sesuai jadwal yang telah ditentukan untuk memastikan kualitas layanan yang optimal
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {serviceHours.map((hour, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`border border-gray-200 rounded-2xl p-4 sm:p-6 lg:p-8 bg-white flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 ${
              hour.day.includes('Jumat') ? 'border-blue-200 bg-blue-50' : hour.day.includes('Libur') ? 'border-gray-200 bg-gray-50' : ''
            }`}
          >
            <div className={`${hour.color} p-2 sm:p-3 lg:p-4 rounded-full mb-3 sm:mb-4 lg:mb-6 text-xl sm:text-2xl`}>
              {hour.icon}
            </div>
            <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 lg:mb-6">{hour.day}</h3>
            
            {hour.hours === 'Libur' ? (
              <div className="text-center">
                <p className="text-red-500 font-medium text-sm sm:text-lg">Libur</p>
              </div>
            ) : (
              <div className="text-center space-y-1 sm:space-y-2 lg:space-y-3">
                <p className="text-gray-700 font-medium text-sm sm:text-base lg:text-lg">{hour.hours}</p>
                {hour.break && <p className="text-gray-500 text-xs sm:text-sm lg:text-base">{hour.break}</p>}
                {hour.afternoon && <p className="text-gray-700 font-medium text-sm sm:text-base lg:text-lg">{hour.afternoon}</p>}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
    </div>
  );
};

export default function Layanan() {
  return (
    <div className='pt-15'>
    <Layout title="Layanan Publik">
      <Head>
        <meta name="description" content="Layanan publik Desa Baula - Pengajuan surat menyurat dan administrasi kependudukan" />
        <meta name="keywords" content="layanan publik, surat keterangan, administrasi, desa Baula" />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-8 sm:py-12 lg:py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6"
          >
            <FaUserCheck className="text-sm sm:text-lg" />
            <span className="hidden sm:inline">Layanan Publik</span>
            <span className="sm:hidden">Layanan</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4"
          >
            <span className="hidden sm:inline">Layanan Publik Desa Baula</span>
            <span className="sm:hidden">Layanan Publik</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-lg lg:text-xl text-green-100 max-w-3xl mx-auto"
          >
            Informasi dan pengajuan layanan administrasi Desa Baula
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-16 space-y-8 sm:space-y-12 lg:space-y-16">
        {/* Service Flow */}
        <ServiceFlow />

        {/* Services */}
        <section>
          <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-green-100">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4"
              >
                <FaFileAlt className="text-sm sm:text-lg" />
                <span className="hidden sm:inline">Jenis Pelayanan</span>
                <span className="sm:hidden">Layanan</span>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3"
              >
                <FaFileAlt className="text-2xl sm:text-3xl lg:text-4xl" />
                <span className="hidden sm:inline">Jenis Pelayanan</span>
                <span className="sm:hidden">Layanan</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-600 text-xs sm:text-sm lg:text-base max-w-3xl mx-auto"
              >
                Berbagai jenis layanan administrasi yang tersedia untuk memenuhi kebutuhan warga Desa Baula
              </motion.p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {services.map((service, index) => (
                <ServiceCard key={index} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Service Hours */}
        <ServiceHours />
      </div>
    </Layout>
    </div>
  )
}