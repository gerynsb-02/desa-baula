import { motion } from 'framer-motion'
import { FaUser } from 'react-icons/fa'
import Image from 'next/image'

export default function CardStruktur({ nama, jabatan, foto }) {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-80 flex flex-col"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Card Content */}
      <div className="relative z-10 p-6 text-center flex flex-col justify-center flex-1">
        {/* Profile Image */}
        <div className="relative mb-6">
          <div className="relative w-32 h-32 mx-auto">
            {/* Image Border with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-1 group-hover:from-green-500 group-hover:to-blue-600 transition-all duration-300">
              <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                {foto ? (
                  <Image
                    src={foto}
                    alt={nama || jabatan}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${foto ? 'hidden' : ''}`}>
                  <FaUser className="text-4xl text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-3 flex-1 flex flex-col justify-center">
          {/* Name */}
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-300 line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
            {nama || 'Nama tidak tersedia'}
          </h3>
          
          {/* Position */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full max-w-full">
              <FaUser className="text-green-600 text-sm flex-shrink-0" />
              <span className="text-sm font-semibold text-green-700 truncate">
                {jabatan || 'Jabatan tidak tersedia'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}