import { useState } from 'react'
import { useRouter } from 'next/router'
import { db } from '../../../lib/firebase'
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore'
import AdminLayout from '../../../components/AdminLayout'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'

export default function TambahRW() {
  const [nama, setNama] = useState('')
  const [lokasi, setLokasi] = useState('')
  const [totalPenduduk, setTotalPenduduk] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const rwDataToSave = {
        nama,
        lokasi,
        total_penduduk: totalPenduduk ? parseInt(totalPenduduk) : null,
        created_at: new Date(),
        updated_at: new Date()
      }

      await addDoc(collection(db, 'data_rw'), rwDataToSave)

      // Update terakhir diperbarui di sumber data
      await updateDoc(doc(db, 'data_statistik', 'sumber'), {
        terakhir_diperbarui: new Date()
      })

      alert('Data RW berhasil ditambahkan!')
      router.push('/admin/data')
    } catch (error) {
      console.error('Error saving RW data:', error)
      alert('Gagal menyimpan data RW')
    }
    setLoading(false)
  }

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-green-700">Tambah Data RW Baru</h1>
                <p className="text-gray-600 mt-1">Buat data RW baru untuk Kelurahan Baula</p>
              </div>
              <Link 
                href="/admin/data" 
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </Link>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nama RW */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama RW <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Contoh: RW 001" 
                    value={nama} 
                    onChange={(e) => setNama(e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900" 
                    required 
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Format: RW diikuti nomor (contoh: RW 001, RW 002)
                  </p>
                </div>

                {/* Lokasi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Tompo Balang" 
                    value={lokasi} 
                    onChange={(e) => setLokasi(e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900" 
                    required 
                  />
                </div>

                {/* Total Penduduk */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Penduduk <span className="text-gray-500">(Opsional)</span>
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="Kosongkan jika tidak ada data" 
                    value={totalPenduduk} 
                    onChange={(e) => setTotalPenduduk(e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900" 
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Masukkan jumlah penduduk dalam angka
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-800">Informasi</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Data akan otomatis memperbarui timestamp &quot;Terakhir Diperbarui&quot; 
                        di halaman publik setelah disimpan.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Link 
                    href="/admin/data" 
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Batal
                  </Link>
                  <button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Simpan RW
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AdminLayout>
    </RequireAuth>
  )
} 