import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import AdminLayout from '../../../components/AdminLayout'
import RequireAuth from '../../../components/RequireAuth'

export default function PengaturanUmum() {
  const [alamat, setAlamat] = useState('')
  const [kontak, setKontak] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const footerDoc = await getDoc(doc(db, 'settings', 'footer'))
        if (footerDoc.exists()) {
          const data = footerDoc.data()
          setAlamat(data.alamat || '')
          setKontak(data.kontak || '')
          setEmail(data.email || '')
        }
      } catch (error) {
        console.error('Error fetching footer settings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await setDoc(doc(db, 'settings', 'footer'), {
        alamat,
        kontak,
        email,
        updatedAt: new Date()
      }, { merge: true })
      alert('Pengaturan berhasil disimpan!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Gagal menyimpan pengaturan.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <RequireAuth>
        <AdminLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        </AdminLayout>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan Umum</h1>
          <p className="text-gray-600 mt-1">Kelola informasi kontak dan pengaturan umum website.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Informasi Kontak & Footer</h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Kantor
                </label>
                <textarea
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Contoh: Kelurahan Baula, Kec. Tellu Limpoe, Kab. Sidrap"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Kontak
                </label>
                <input
                  type="text"
                  value={kontak}
                  onChange={(e) => setKontak(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Contoh: 081234567890"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Contoh: kelurahanbaula712@gmail.com"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className={`
                    px-6 py-2.5 rounded-lg text-white font-medium
                    ${saving 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                    }
                    transition-all duration-200 flex items-center space-x-2 shadow-sm
                  `}
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Simpan Pengaturan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    </RequireAuth>
  )
}
