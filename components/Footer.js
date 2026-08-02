import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-400 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-teal-400 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="relative container mx-auto px-6 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Logo and Address Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <Image 
                    src="/images/logo.png" 
                    alt="Logo Desa Baula" 
                    width={60}
                    height={60}
                    className="w-15 h-15 object-contain"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                  Desa Baula
                </h2>
                <p className="text-emerald-200 text-sm font-medium">Kecamatan Tellu Limpoe, Kabupaten Sidrap</p>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-500/20 p-3 rounded-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Alamat Kantor</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Desa Baula, Kec. Tellu Limpoe<br />
                    Kab. Sidrap, Sulawesi Selatan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white relative">
              Tautan Cepat
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
            </h3>
            <nav className="space-y-3">
              {[
                { href: '/berita', label: 'Berita', icon: '📰' },
                { href: '/profil', label: 'Profil Desa', icon: '🏢' },
                { href: '/layanan', label: 'Layanan Publik', icon: '🔧' },
                { href: '/galeri', label: 'Galeri', icon: '📸' },
                { href: '/data', label: 'Data & Statistik', icon: '📊' }
              ].map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="group flex items-center space-x-3 text-white/80 hover:text-white transition-all duration-300 transform hover:translate-x-2"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium group-hover:text-emerald-200">
                    {item.label}
                  </span>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
              ))}
            </nav>
          </div>

          {/* Office Hours */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white relative">
              Jam Operasional
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
            </h3>
            <div className="space-y-4">
              {[
                { days: 'Senin - Kamis', hours: '07.30 - 16.00 WITA', status: 'open' },
                { days: 'Jumat', hours: '07.30 - 16.30 WITA', status: 'open' },
                { days: 'Minggu & Hari Libur', hours: 'Tutup', status: 'closed' }
              ].map((schedule, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${schedule.status === 'open' ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`}></div>
                      <div>
                        <p className="text-white font-medium text-sm">{schedule.days}</p>
                        <p className={`text-xs ${schedule.status === 'open' ? 'text-emerald-200' : 'text-red-200'}`}>
                          {schedule.hours}
                        </p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 ${schedule.status === 'open' ? 'text-emerald-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col items-center space-y-3">
            <div className="text-center">
              <p className="text-white/70 text-sm">
                &copy; {new Date().getFullYear()} Desa Baula. Semua hak cipta dilindungi.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-white/60">
              <span>Dikembangkan untuk Desa Baula, Kec. Tellu Limpoe, Kab. Sidrap</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2">
              <span className="text-emerald-300 text-lg">🎓</span>
              <span className="text-white/90 text-xs font-semibold tracking-wide">
                Dikembangkan oleh KKNT116 Universitas Hasanuddin
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}