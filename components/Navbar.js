import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, FaUsers, FaUser, FaCogs, FaDatabase, FaNewspaper, FaImages, FaSignInAlt, FaBars, FaTimes 
} from 'react-icons/fa';
import Image from 'next/image';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();

    // Check if current page is homepage
    const isHomePage = router.pathname === '/';

    useEffect(() => {
        const handleRouteChange = () => setMenuOpen(false);
        router.events.on('routeChangeComplete', handleRouteChange);
        return () => router.events.off('routeChangeComplete', handleRouteChange);
    }, [router]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { href: '/', label: 'Beranda', icon: FaHome },
        { href: '/profil', label: 'Profil Kelurahan', icon: FaUser },
        { href: '/layanan', label: 'Layanan', icon: FaCogs },
        { href: '/data', label: 'Demografi', icon: FaDatabase },
        { href: '/berita', label: 'Berita', icon: FaNewspaper },
        { href: '/galeri', label: 'Galeri', icon: FaImages },
    ];

    // Determine navbar background based on page and scroll state
    const getNavbarBackground = () => {
        if (isHomePage) {
            return scrolled ? 'bg-green-700 shadow-lg' : 'bg-transparent';
        } else {
            return 'bg-green-700 shadow-lg';
        }
    };

    // Determine text colors based on page and scroll state
    const getTextColor = () => {
        if (isHomePage) {
            return scrolled ? 'text-white' : 'text-white drop-shadow-lg';
        } else {
            return 'text-white';
        }
    };

    const getSubtitleColor = () => {
        if (isHomePage) {
            return scrolled ? 'text-green-100' : 'text-green-100 drop-shadow-lg';
        } else {
            return 'text-green-100';
        }
    };

    return (
        <motion.nav 
            className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${getNavbarBackground()}`}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-3">
                    {/* Logo/Branding */}
                    <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Image 
                                src="/images/logo.png" 
                                alt="Logo Kelurahan Balleangin" 
                                width={48}
                                height={48}
                                className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 object-contain"
                            />
                        </motion.div>
                        <div className="block">
                            <h1 className={`font-bold text-xs sm:text-sm lg:text-lg transition-colors duration-300 ${getTextColor()}`}>
                                Kelurahan Balleangin
                            </h1>
                            <p className={`text-xs transition-colors duration-300 ${getSubtitleColor()}`}>
                                Kabupaten Pangkep
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <NavLink 
                                key={item.href}
                                href={item.href} 
                                currentPath={router.pathname}
                                isHomePage={isHomePage}
                                scrolled={scrolled}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                        
                        {/* Admin Login Button */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <a href="/admin/login" target="_blank" rel="noopener noreferrer">
                                <span className="ml-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                                    <FaSignInAlt className="text-sm" />
                                    Admin
                                </span>
                            </a>
                        </motion.div>
                    </div>

                    {/* Tablet Navigation */}
                    <div className="hidden md:flex lg:hidden items-center space-x-1">
                        {navItems.slice(0, 4).map((item) => (
                            <NavLink 
                                key={item.href}
                                href={item.href} 
                                currentPath={router.pathname}
                                isHomePage={isHomePage}
                                scrolled={scrolled}
                                compact
                            >
                                {item.label.split(' ')[0]}
                            </NavLink>
                        ))}
                        
                        {/* Admin Login Button for Tablet */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <a href="/admin/login" target="_blank" rel="noopener noreferrer">
                                <span className="ml-2 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-1">
                                    <FaSignInAlt className="text-xs" />
                                    Admin
                                </span>
                            </a>
                        </motion.div>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        className="md:hidden p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <AnimatePresence mode="wait">
                            {menuOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaTimes className={`w-6 h-6 ${getTextColor()}`} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaBars className={`w-6 h-6 ${getTextColor()}`} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div 
                            className="md:hidden bg-green-700/95 backdrop-blur-md mt-2 py-4 rounded-2xl shadow-xl border border-green-600/30"
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <MobileNavLink 
                                        href={item.href} 
                                        currentPath={router.pathname}
                                        icon={item.icon}
                                    >
                                        {item.label}
                                    </MobileNavLink>
                                </motion.div>
                            ))}
                            
                            {/* Admin Login Button for Mobile */}
                            <motion.div 
                                className="border-t border-green-600/30 mt-4 pt-4"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                            >
                                <a href="/admin/login" target="_blank" rel="noopener noreferrer">
                                    <span className="mx-4 px-4 py-3 text-sm bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl flex items-center gap-3">
                                        <FaSignInAlt className="text-sm" />
                                        Admin Login
                                    </span>
                                </a>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}

// Component for desktop navigation links
function NavLink({ href, currentPath, isHomePage, scrolled, compact, children }) {
    const isActive = currentPath === href;
    
    const getLinkStyles = () => {
        if (isHomePage) {
            return isActive 
                ? 'bg-white/20 text-white shadow-lg' 
                : scrolled 
                    ? 'text-green-100 hover:bg-white/10' 
                    : 'text-white hover:bg-white/10 drop-shadow-lg';
        } else {
            return isActive 
                ? 'bg-white/20 text-white shadow-lg' 
                : 'text-green-100 hover:bg-white/10';
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Link href={href}>
                <span className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${getLinkStyles()}`}>
                    {children}
                </span>
            </Link>
        </motion.div>
    );
}

// Component for mobile navigation links
function MobileNavLink({ href, currentPath, icon: Icon, children }) {
    const isActive = currentPath === href;
    return (
        <Link href={href}>
            <span className={`px-6 py-3 text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
                isActive 
                    ? 'bg-white/20 text-white' 
                    : 'text-green-100 hover:bg-white/10'
            }`}>
                <Icon className="text-sm" />
                {children}
            </span>
        </Link>
    );
}