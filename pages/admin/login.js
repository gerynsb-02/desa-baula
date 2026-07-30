import { useState, useEffect } from 'react'
import { auth } from '../../lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { 
  FaUserShield, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner, 
  FaShieldAlt, FaExclamationTriangle, FaBuilding, FaArrowLeft,
  FaCheckCircle, FaTimesCircle, FaInfoCircle
} from 'react-icons/fa'
import Head from 'next/head'
import Link from 'next/link'

export default function LoginAdmin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [isValidEmail, setIsValidEmail] = useState(false)

  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/admin')
      }
    })
    return () => unsubscribe()
  }, [router])



  // Email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsValidEmail(email.length > 0 && emailRegex.test(email))
  }, [email])



    const handleLogin = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!email || !password) {
      setError('Email dan password harus diisi.')
      return
    }
    
    if (!isValidEmail) {
      setError('Format email tidak valid.')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/admin')
    } catch (error) {
      let errorMessage = 'Login gagal. Silakan coba lagi.'
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Email tidak terdaftar dalam sistem.'
          break
        case 'auth/wrong-password':
          errorMessage = 'Password yang Anda masukkan salah.'
          break
        case 'auth/invalid-email':
          errorMessage = 'Format email tidak valid.'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Terlalu banyak percobaan login. Silakan coba lagi nanti.'
          break
        case 'auth/user-disabled':
          errorMessage = 'Akun telah dinonaktifkan oleh administrator.'
          break
        case 'auth/network-request-failed':
          errorMessage = 'Koneksi internet bermasalah. Silakan periksa koneksi Anda.'
          break
        default:
          errorMessage = 'Terjadi kesalahan sistem. Silakan coba lagi.'
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <>
      <Head>
        <title>Login Admin - Desa Baula</title>
        <meta name="description" content="Halaman login admin Desa Baula" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="w-full max-w-sm mx-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <FaUserShield className="text-xl text-white" />
              </div>
              <h1 className="text-xl font-bold text-white mb-1">
                Admin Panel
              </h1>
              <p className="text-blue-100 text-sm">Desa Baula</p>
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                                 {/* Error Message */}
                 {error && (
                   <div className="rounded-lg p-3 text-sm flex items-start gap-2 border bg-red-50 border-red-200 text-red-700">
                     <FaTimesCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                     <div className="flex-1">
                       <p className="font-medium">{error}</p>
                     </div>
                   </div>
                 )}

                {/* Email Field */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaEnvelope className="text-blue-500" />
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Masukkan email admin"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 text-sm"
                       required
                       disabled={isLoading}
                    />
                    {email.length > 0 && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {isValidEmail ? 
                          <FaCheckCircle className="text-green-500" /> : 
                          <FaTimesCircle className="text-red-500" />
                        }
                      </div>
                    )}
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaLock className="text-green-500" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                                             className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 text-sm"
                       required
                       disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                       disabled={isLoading}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>

                  </div>
                </div>

                {/* Login Button */}
                                 <button
                   type="submit"
                   disabled={isLoading || !isValidEmail}
                   className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                 >
                   {isLoading ? (
                     <>
                       <FaSpinner className="animate-spin" />
                       <span>Memproses...</span>
                     </>
                   ) : (
                     <>
                       <FaUserShield />
                       <span>Login</span>
                     </>
                   )}
                 </button>
              </form>



              {/* Footer */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  © {new Date().getFullYear()} Desa Baula
                </p>
              </div>
            </div>
          </motion.div>

          {/* Back to Home Link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors duration-200"
            >
              <FaArrowLeft />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
