import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import AdminLayout from '../../../components/AdminLayout'
import RequireAuth from '../../../components/RequireAuth'

export default function EditData() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [isNewData, setIsNewData] = useState(false)
  
  // Form states
  const [penduduk, setPenduduk] = useState({
    total: '',
    laki_laki: '',
    perempuan: '',
    jumlah_kk: '',
    jumlah_rt: '',
    luas_wilayah: ''
  })
  
  const [sumber, setSumber] = useState({
    sumber_data: '',
    terakhir_diperbarui: new Date()
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pendudukSnap = await getDoc(doc(db, 'data_statistik', 'penduduk'))
        const sumberSnap = await getDoc(doc(db, 'data_statistik', 'sumber'))

        if (pendudukSnap.exists()) {
          setPenduduk(pendudukSnap.data())
        } else {
          setIsNewData(true)
        }
        if (sumberSnap.exists()) {
          setSumber(sumberSnap.data())
        }
      } catch (error) {
        console.error('Gagal mengambil data:', error)
        alert('Gagal mengambil data')
      } finally {
        setFetching(false)
      }
    }

    fetchData()
  }, [])

  const handlePendudukChange = (field, value) => {
    setPenduduk(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSumberChange = (field, value) => {
    setSumber(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const currentDate = new Date()
      
      // Create or update penduduk data
      if (isNewData) {
        await setDoc(doc(db, 'data_statistik', 'penduduk'), {
          total: parseInt(penduduk.total),
          laki_laki: parseInt(penduduk.laki_laki),
          perempuan: parseInt(penduduk.perempuan),
          jumlah_kk: parseInt(penduduk.jumlah_kk),
          jumlah_rt: parseInt(penduduk.jumlah_rt),
          luas_wilayah: parseFloat(penduduk.luas_wilayah)
        })
      } else {
        await updateDoc(doc(db, 'data_statistik', 'penduduk'), {
          ...penduduk,
          total: parseInt(penduduk.total),
          laki_laki: parseInt(penduduk.laki_laki),
          perempuan: parseInt(penduduk.perempuan),
          jumlah_kk: parseInt(penduduk.jumlah_kk),
          jumlah_rt: parseInt(penduduk.jumlah_rt),
          luas_wilayah: parseFloat(penduduk.luas_wilayah)
        })
      }

      // Create or update sumber data with automatic timestamp
      await setDoc(doc(db, 'data_statistik', 'sumber'), {
        sumber_data: sumber.sumber_data,
        terakhir_diperbarui: currentDate
      })

      alert(isNewData ? 'Data berhasil dibuat!' : 'Data berhasil diperbarui!')
      router.push('/admin/data')
    } catch (error) {
      console.error('Error saving data:', error)
      alert('Gagal menyimpan data')
    }

    setLoading(false)
  }

  if (fetching) {
    return (
      <RequireAuth>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        </AdminLayout>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="p-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-green-700">
              {isNewData ? 'Buat Data Statistik' : 'Edit Data Statistik'}
            </h1>
            <button
              onClick={() => router.push('/admin/data')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Kembali
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Data Kependudukan */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Kependudukan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Penduduk
                  </label>
                  <input
                    type="number"
                    value={penduduk.total}
                    onChange={(e) => handlePendudukChange('total', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Penduduk Laki-laki
                  </label>
                  <input
                    type="number"
                    value={penduduk.laki_laki}
                    onChange={(e) => handlePendudukChange('laki_laki', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Penduduk Perempuan
                  </label>
                  <input
                    type="number"
                    value={penduduk.perempuan}
                    onChange={(e) => handlePendudukChange('perempuan', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah KK
                  </label>
                  <input
                    type="number"
                    value={penduduk.jumlah_kk}
                    onChange={(e) => handlePendudukChange('jumlah_kk', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Data Wilayah */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Wilayah</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah RT
                  </label>
                  <input
                    type="number"
                    value={penduduk.jumlah_rt}
                    onChange={(e) => handlePendudukChange('jumlah_rt', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Luas Wilayah (km²)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={penduduk.luas_wilayah}
                    onChange={(e) => handlePendudukChange('luas_wilayah', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Informasi Sumber Data */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Sumber Data</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sumber Data
                </label>
                <input
                  type="text"
                  value={sumber.sumber_data}
                  onChange={(e) => handleSumberChange('sumber_data', e.target.value)}
                  placeholder="Contoh: Kantor Kelurahan Balleangin"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin/data')}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : (isNewData ? 'Buat Data' : 'Simpan Perubahan')}
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </RequireAuth>
  )
} 