import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import RequireAuth from '../../../components/RequireAuth'
import AdminLayout from '../../../components/AdminLayout'
import {
  FiSave, FiBook, FiBullseye, FiMapPin, FiPlus, FiTrash2,
  FiCheck, FiAlertCircle, FiLoader, FiRefreshCw, FiInfo
} from 'react-icons/fi'
import { FaHistory, FaBullseye, FaMapMarkedAlt } from 'react-icons/fa'

// ─── Default data fallback ────────────────────────────────────────────────────
const DEFAULT_DATA = {
  sejarah: {
    asalUsul: 'Baula adalah kelurahan di Kecamatan Tellu Limpoe, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan. Kelurahan Baula merupakan salah satu kelurahan yang terus berkembang di wilayah Kabupaten Sidrap.',
    letakGeografis: 'Terletak sekitar 48 km dari pusat kabupaten dengan waktu tempuh 1.5 jam. Wilayah ini dikelilingi oleh hamparan sawah dan dialiri sungai yang menjadi sumber kehidupan masyarakat.',
    kehidupanMasyarakat: 'Mayoritas penduduk bekerja sebagai petani, pedagang, dan peternak. Masyarakat Kelurahan Baula dikenal dengan semangat gotong royong yang tinggi dalam membangun daerahnya.',
    potensiWisata: 'Kelurahan Baula menawarkan potensi alam dan budaya yang beragam. Masyarakat kelurahan terus berupaya mengembangkan potensi lokal untuk meningkatkan kesejahteraan warga.',
    budayaKuliner: 'Memiliki kekayaan budaya dan kuliner khas yang menjadi daya tarik wisatawan.'
  },
  visiMisi: {
    visi: 'Tercapainya Pelayanan Kepada Masyarakat yang Inovatif dan Profesional',
    misi: [
      'Mewujudkan pelayanan kepada dan sumber daya masyarakat yang berkualitas dan adil',
      'Meningkatkan potensi sumber daya alam',
      'Mewujudkan pembangunan berbasis kesejahteraan rakyat',
      'Meningkatkan potensi pariwisata berbasis komunitas',
      'Meningkatkan kebersamaan aparatur pemerintah dan masyarakat dalam membangun kreatifitas'
    ]
  },
  batasWilayah: {
    utara: 'Kelurahan Balocci',
    timur: 'Laut Flores',
    selatan: 'Kelurahan Bontoa',
    barat: 'Kelurahan Bungoro'
  }
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [onClose])

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  }
  const icons = {
    success: <FiCheck className="w-5 h-5 text-green-600" />,
    error: <FiAlertCircle className="w-5 h-5 text-red-600" />
  }

  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border shadow-lg animate-fade-in ${styles[type]}`}>
      {icons[type]}
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 text-current opacity-50 hover:opacity-100">✕</button>
    </div>
  )
}

// ─── Tab Button ───────────────────────────────────────────────────────────────
function TabButton({ id, label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
        active
          ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-md'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-4 mb-6 pb-4 border-b border-slate-100">
      <div className="p-3 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl">
        <Icon className="w-6 h-6 text-green-700" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
  )
}

// ─── Textarea Field ───────────────────────────────────────────────────────────
function TextareaField({ label, value, onChange, rows = 3, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 resize-y leading-relaxed"
      />
    </div>
  )
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
      />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminProfil() {
  const [activeTab, setActiveTab] = useState('sejarah')
  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [newMisiText, setNewMisiText] = useState('')

  // ── Load data from Firestore ─────────────────────────────────────────────
  const loadData = async () => {
    setLoading(true)
    try {
      const docRef = doc(db, 'profil', 'konten')
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        // Deep merge with defaults to handle missing fields
        setFormData({
          sejarah: { ...DEFAULT_DATA.sejarah, ...data.sejarah },
          visiMisi: {
            ...DEFAULT_DATA.visiMisi,
            ...data.visiMisi,
            misi: data.visiMisi?.misi || DEFAULT_DATA.visiMisi.misi
          },
          batasWilayah: { ...DEFAULT_DATA.batasWilayah, ...data.batasWilayah }
        })
      } else {
        // Use defaults if document doesn't exist yet
        setFormData(JSON.parse(JSON.stringify(DEFAULT_DATA)))
      }
    } catch (err) {
      console.error('Error loading profil:', err)
      setFormData(JSON.parse(JSON.stringify(DEFAULT_DATA)))
      showToast('Gagal memuat data, menggunakan data default.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  // ── Toast helpers ────────────────────────────────────────────────────────
  const showToast = (message, type) => setToast({ message, type })
  const hideToast = () => setToast(null)

  // ── Update helpers ───────────────────────────────────────────────────────
  const updateSejarah = (field, value) => {
    setFormData(prev => ({ ...prev, sejarah: { ...prev.sejarah, [field]: value } }))
  }

  const updateVisiMisi = (field, value) => {
    setFormData(prev => ({ ...prev, visiMisi: { ...prev.visiMisi, [field]: value } }))
  }

  const updateMisiItem = (index, value) => {
    const newMisi = [...formData.visiMisi.misi]
    newMisi[index] = value
    updateVisiMisi('misi', newMisi)
  }

  const addMisiItem = () => {
    const text = newMisiText.trim()
    if (!text) return
    updateVisiMisi('misi', [...formData.visiMisi.misi, text])
    setNewMisiText('')
  }

  const removeMisiItem = (index) => {
    const newMisi = formData.visiMisi.misi.filter((_, i) => i !== index)
    updateVisiMisi('misi', newMisi)
  }

  const updateBatas = (field, value) => {
    setFormData(prev => ({ ...prev, batasWilayah: { ...prev.batasWilayah, [field]: value } }))
  }

  // ── Save to Firestore ────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, 'profil', 'konten'), {
        ...formData,
        updatedAt: serverTimestamp()
      })
      showToast('Profil berhasil disimpan!', 'success')
    } catch (err) {
      console.error('Error saving profil:', err)
      showToast('Gagal menyimpan data. Coba lagi.', 'error')
    } finally {
      setSaving(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <RequireAuth>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4 text-slate-500">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
              <p className="text-sm">Memuat data profil...</p>
            </div>
          </div>
        </AdminLayout>
      </RequireAuth>
    )
  }

  const tabs = [
    { id: 'sejarah', label: 'Sejarah', icon: FaHistory },
    { id: 'visi-misi', label: 'Visi & Misi', icon: FaBullseye },
    { id: 'batas-wilayah', label: 'Batas Wilayah', icon: FaMapMarkedAlt }
  ]

  return (
    <RequireAuth>
      <AdminLayout>
        {/* Toast */}
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={hideToast} />
        )}

        <div className="animate-fade-in space-y-6">
          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-1">
                Kelola Profil Kelurahan
              </h1>
              <p className="text-slate-500 text-sm">
                Edit konten halaman profil yang ditampilkan kepada pengunjung
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-blue-600 rounded-xl hover:from-green-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <><FiLoader className="w-4 h-4 animate-spin" /> Menyimpan...</>
                ) : (
                  <><FiSave className="w-4 h-4" /> Simpan Perubahan</>
                )}
              </button>
            </div>
          </div>

          {/* ── Info Banner ─────────────────────────────────────────────── */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-sm">
            <FiInfo className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>Perubahan yang disimpan akan langsung tampil di halaman publik <strong>/profil</strong>. Pastikan semua konten sudah benar sebelum menyimpan.</p>
          </div>

          {/* ── Tabs ────────────────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <TabButton
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                active={activeTab === tab.id}
                onClick={setActiveTab}
              />
            ))}
          </div>

          {/* ── Tab Content ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:p-8">

            {/* ── TAB: Sejarah ─────────────────────────────────────────── */}
            {activeTab === 'sejarah' && (
              <div className="space-y-6">
                <SectionHeader
                  icon={FaHistory}
                  title="Konten Sejarah"
                  description="Kelola teks untuk setiap sub-bagian di tab Sejarah halaman profil"
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TextareaField
                    label="🏛️ Asal Usul"
                    value={formData.sejarah.asalUsul}
                    onChange={v => updateSejarah('asalUsul', v)}
                    rows={4}
                    hint="Ditampilkan di kartu hijau kiri atas"
                  />
                  <TextareaField
                    label="🌍 Letak Geografis"
                    value={formData.sejarah.letakGeografis}
                    onChange={v => updateSejarah('letakGeografis', v)}
                    rows={4}
                    hint="Ditampilkan di kartu biru kanan atas"
                  />
                </div>
                <TextareaField
                  label="👥 Kehidupan Masyarakat"
                  value={formData.sejarah.kehidupanMasyarakat}
                  onChange={v => updateSejarah('kehidupanMasyarakat', v)}
                  rows={3}
                  hint="Ditampilkan di kartu amber lebar"
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TextareaField
                    label="🏔️ Potensi Wisata"
                    value={formData.sejarah.potensiWisata}
                    onChange={v => updateSejarah('potensiWisata', v)}
                    rows={4}
                    hint="Ditampilkan di kartu ungu kiri bawah"
                  />
                  <TextareaField
                    label="🍜 Budaya & Kuliner"
                    value={formData.sejarah.budayaKuliner}
                    onChange={v => updateSejarah('budayaKuliner', v)}
                    rows={4}
                    hint="Ditampilkan di kartu merah kanan bawah"
                  />
                </div>
              </div>
            )}

            {/* ── TAB: Visi & Misi ─────────────────────────────────────── */}
            {activeTab === 'visi-misi' && (
              <div className="space-y-8">
                <SectionHeader
                  icon={FaBullseye}
                  title="Visi & Misi Kelurahan"
                  description="Edit visi dan daftar misi yang ditampilkan di halaman profil"
                />

                {/* Visi */}
                <div className="space-y-3">
                  <TextareaField
                    label="✨ Visi"
                    value={formData.visiMisi.visi}
                    onChange={v => updateVisiMisi('visi', v)}
                    rows={3}
                    hint="Pernyataan visi yang ditampilkan dalam tanda petik"
                  />
                </div>

                {/* Misi */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700">📋 Daftar Misi</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formData.visiMisi.misi.length} butir misi
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {formData.visiMisi.misi.map((misi, index) => (
                      <div key={index} className="flex items-start gap-3 group">
                        <div className="flex-shrink-0 w-8 h-8 mt-1 bg-gradient-to-br from-green-100 to-green-200 text-green-800 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <textarea
                          value={misi}
                          onChange={e => updateMisiItem(index, e.target.value)}
                          rows={2}
                          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 resize-none leading-relaxed"
                        />
                        <button
                          onClick={() => removeMisiItem(index)}
                          className="flex-shrink-0 mt-1 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Hapus butir misi"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add new misi */}
                  <div className="flex items-center gap-3 pt-2 border-t border-dashed border-slate-200">
                    <input
                      type="text"
                      value={newMisiText}
                      onChange={e => setNewMisiText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addMisiItem() } }}
                      placeholder="Tulis butir misi baru... (tekan Enter atau klik +)"
                      className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent focus:bg-white transition-all duration-200"
                    />
                    <button
                      onClick={addMisiItem}
                      disabled={!newMisiText.trim()}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <FiPlus className="w-4 h-4" />
                      Tambah
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Batas Wilayah ───────────────────────────────────── */}
            {activeTab === 'batas-wilayah' && (
              <div className="space-y-6">
                <SectionHeader
                  icon={FaMapMarkedAlt}
                  title="Batas Wilayah"
                  description="Edit nama wilayah yang berbatasan di setiap arah mata angin"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                      <span className="text-lg">⬆️</span> Batas Utara
                    </div>
                    <input
                      type="text"
                      value={formData.batasWilayah.utara}
                      onChange={e => updateBatas('utara', e.target.value)}
                      placeholder="Nama wilayah di utara..."
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                      <span className="text-lg">➡️</span> Batas Timur
                    </div>
                    <input
                      type="text"
                      value={formData.batasWilayah.timur}
                      onChange={e => updateBatas('timur', e.target.value)}
                      placeholder="Nama wilayah di timur..."
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                      <span className="text-lg">⬇️</span> Batas Selatan
                    </div>
                    <input
                      type="text"
                      value={formData.batasWilayah.selatan}
                      onChange={e => updateBatas('selatan', e.target.value)}
                      placeholder="Nama wilayah di selatan..."
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                      <span className="text-lg">⬅️</span> Batas Barat
                    </div>
                    <input
                      type="text"
                      value={formData.batasWilayah.barat}
                      onChange={e => updateBatas('barat', e.target.value)}
                      placeholder="Nama wilayah di barat..."
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-4 p-5 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-green-100">
                  <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <FaMapMarkedAlt /> Preview Batas Wilayah
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      { icon: '⬆️', arah: 'Utara', val: formData.batasWilayah.utara },
                      { icon: '➡️', arah: 'Timur', val: formData.batasWilayah.timur },
                      { icon: '⬇️', arah: 'Selatan', val: formData.batasWilayah.selatan },
                      { icon: '⬅️', arah: 'Barat', val: formData.batasWilayah.barat }
                    ].map(item => (
                      <div key={item.arah} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm">
                        <span>{item.icon}</span>
                        <span className="font-medium text-gray-700">{item.arah}:</span>
                        <span className="text-gray-600 truncate">{item.val || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Bottom Save Button ───────────────────────────────────────────── */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-blue-600 rounded-xl hover:from-green-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <><FiLoader className="w-4 h-4 animate-spin" /> Menyimpan...</>
              ) : (
                <><FiSave className="w-4 h-4" /> Simpan Semua Perubahan</>
              )}
            </button>
          </div>
        </div>
      </AdminLayout>
    </RequireAuth>
  )
}
