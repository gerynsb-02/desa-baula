import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useState, useEffect } from 'react'
import { 
  FiHome, 
  FiFileText, 
  FiUsers, 
  FiSettings, 
  FiLogOut,
  FiChevronRight,
  FiLayers,
  FiCalendar,
  FiBarChart2,
  FiImage,
  FiUser,
  FiShield,
  FiMonitor,
  FiMenu,
  FiX,
  FiBell,
  FiSearch,
  FiTrendingUp,
  FiDatabase,
  FiMapPin
} from 'react-icons/fi'

// Group links by category for better organization
const linkGroups = [
  {
    title: 'Dashboard',
    links: [
      { href: '/admin', label: 'Dashboard', icon: <FiHome className="w-5 h-5" />, badge: null }
    ]
  },
  {
    title: 'Konten',
    links: [
      { href: '/admin/berita', label: 'Kelola Berita', icon: <FiFileText className="w-5 h-5" />, badge: null },
      { href: '/admin/struktur', label: 'Kelola Struktur', icon: <FiUsers className="w-5 h-5" />, badge: null },
      { href: '/admin/galeri', label: 'Kelola Galeri', icon: <FiImage className="w-5 h-5" />, badge: null },
      { href: '/admin/hero', label: 'Kelola Hero', icon: <FiMonitor className="w-5 h-5" />, badge: null }
    ]
  },
  {
    title: 'Data',
    links: [
      { href: '/admin/data', label: 'Kelola Data', icon: <FiBarChart2 className="w-5 h-5" />, badge: null }
    ]
  }
]

export default function AdminSidebar() {
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/admin/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen)

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg border border-gray-200"
      >
        {isMobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        <div className="h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiShield className="w-7 h-7 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-white">Admin Panel</h2>
                  <p className="text-xs text-slate-400">Kelurahan Balleangin</p>
                </div>
              )}
              <button
                onClick={toggleSidebar}
                className="hidden lg:block p-1 rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                <FiChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
            <div className="space-y-6">
              {linkGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  {!isCollapsed && (
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
                      {group.title}
                    </h3>
                  )}
                  <ul className="space-y-1">
                    {group.links.map(link => {
                      const isActive = router.pathname === link.href
                      return (
                        <li key={link.href}>
                          <Link href={link.href}>
                            <div className={`
                              flex items-center justify-between p-3 rounded-xl
                              ${isActive 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'}
                              transition-all duration-300 group relative overflow-hidden
                            `}>
                              {/* Active indicator */}
                              {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                              )}
                              
                              <div className="flex items-center gap-3">
                                <span className={`
                                  ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}
                                  transition-all duration-300 group-hover:scale-110
                                `}>
                                  {link.icon}
                                </span>
                                {!isCollapsed && (
                                  <span className="font-medium">{link.label}</span>
                                )}
                              </div>
                              
                              {!isCollapsed && (
                                <div className="flex items-center gap-2">
                                  {link.badge && (
                                    <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                                      {link.badge}
                                    </span>
                                  )}
                                  <FiChevronRight className={`
                                    w-4 h-4 transition-all duration-300
                                    ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}
                                    ${isActive ? 'rotate-90' : 'rotate-0'}
                                  `} />
                                </div>
                              )}
                            </div>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          {/* Footer with user info and logout */}
          <div className="p-4 border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 mb-3 bg-slate-700/50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <FiUser className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.email || 'Administrator'}
                  </p>
                  <p className="text-xs text-slate-400">Kelurahan Balleangin</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            {!isCollapsed && (
              <div className="mb-3 p-3 bg-slate-700/30 rounded-xl">
                <div className="flex items-center justify-between text-xs">
                  <div className="text-slate-400">Status</div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400">Online</span>
                  </div>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 text-slate-300 hover:bg-red-600/20 hover:text-red-400 rounded-xl transition-all duration-300 group"
            >
              <FiLogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              {!isCollapsed && <span className="font-medium">Keluar</span>}
            </button>
          </div>
        </div>
      </div>


    </>
  )
}