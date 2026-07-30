import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaArrowRight, FaNewspaper } from 'react-icons/fa'
import Image from 'next/image'

export default function CardBerita({ id, slug, gambar = '', judul = '', tanggal = '', sumber = '', isi = '' }) {
  const imageSrc = gambar?.startsWith('http') ? gambar : (gambar ? `/images/berita/${gambar}` : '/images/default-news.jpg')
  


  // Simple date formatting with better error handling
  const formatDateSimple = (dateField) => {
    try {
      if (!dateField) return 'Tanggal tidak tersedia'
      
      let date
      
      if (typeof dateField === 'object') {
        if (dateField.seconds) {
          date = new Date(dateField.seconds * 1000)
        } else if (dateField.toDate && typeof dateField.toDate === 'function') {
          date = dateField.toDate()
        } else if (dateField instanceof Date) {
          date = dateField
        } else {
          date = new Date(dateField)
        }
      } else if (typeof dateField === 'string') {
        // Handle timezone strings and various date formats
        let cleanDate = dateField
        if (cleanDate.includes('UTC+8')) {
          cleanDate = cleanDate.replace(' UTC+8', '')
        } else if (cleanDate.includes('UTC')) {
          cleanDate = cleanDate.replace(' UTC', '')
        }
        date = new Date(cleanDate)
      } else if (typeof dateField === 'number') {
        date = new Date(dateField)
      } else {
        date = new Date()
      }
      
      if (isNaN(date.getTime())) {
        // Try alternative parsing for string dates
        if (typeof dateField === 'string') {
          // Try parsing as ISO string without timezone
          const isoMatch = dateField.match(/(\w+ \d+, \d{4})/)
          if (isoMatch) {
            const isoDate = new Date(isoMatch[1])
            if (!isNaN(isoDate.getTime())) {
              return isoDate.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            }
          }
        }
        return 'Tanggal tidak tersedia'
      }
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Tanggal tidak tersedia'
    }
  }

  const formattedDate = formatDateSimple(tanggal)

  return (
    <Link href={`/berita/${slug || id}`} passHref>
      <motion.div 
        className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 flex flex-col h-96 hover:border-green-200"
        whileHover={{ y: -4 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image with gradient overlay */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image 
            width={400}
            height={192}
            src={imageSrc} 
            alt={judul} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          
          {/* Date badge */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
            <FaCalendarAlt className="text-green-600 text-xs" />
            <span className="text-xs font-medium text-gray-800">{formattedDate}</span>
          </div>
          
          {/* Source badge */}
          {sumber && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs px-2.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1">
              <FaNewspaper className="text-xs" />
              <span className="truncate max-w-16">{sumber}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-base font-bold text-gray-800 mb-2 hover:text-green-600 transition-colors line-clamp-2 leading-tight min-h-[2.5rem] flex items-center">
            {judul}
          </h3>
          
          <p className="text-gray-600 mb-3 line-clamp-3 flex-1 text-sm leading-relaxed">
            {isi}
          </p>
          
          <div className="mt-auto">
            <span className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors text-sm">
              Baca selengkapnya
              <FaArrowRight className="w-3 h-3 ml-2 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}