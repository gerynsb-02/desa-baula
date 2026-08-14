import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import RequireAuth from '../../../components/RequireAuth'
import AdminLayout from '../../../components/AdminLayout'
import {
  FiSave, FiPlus, FiTrash2, FiCheck, FiAlertCircle,
  FiLoader, FiRefreshCw, FiInfo, FiChevronDown, FiChevronUp,
  FiMove, FiEdit2, FiClock, FiList, FiGitMerge
} from 'react-icons/fi'
import { FaClipboardList, FaFileAlt, FaClock } from 'react-icons/fa'

// ─── Default Data ─────────────────────────────────────────────────────────────
const DEFAULT_DATA = {
  alurPelayanan: [
    { title: 'Pemohon', description: 'Warga datang ke kelurahan', color: 'green' },
    { title: 'Meja Pelayanan', description: 'Mengisi formulir permohonan', color: 'blue' },
    { title: 'Pemeriksaan Berkas', description: 'Petugas memeriksa kelengkapan dokumen', color: 'yellow' },
    { title: 'Input Data', description: 'Petugas memproses dan mencetak dokumen', color: 'purple' },
    { title: 'Pengesahan', description: 'Penandatanganan oleh lurah', color: 'pink' },
    { title: 'Penyerahan', description: 'Dokumen diberikan ke pemohon', color: 'green' }
  ],
  jenisPelayanan: [
    { title: 'Surat Keterangan Tidak Mampu', description: 'Pengajuan surat keterangan tidak mampu untuk keperluan administrasi.', requirements: ['Fotocopy KK', 'Fotocopy KTP', 'Surat pengantar RT/RW'], color: 'red' },
    { title: 'Surat Keterangan Domisili', description: 'Pengajuan surat keterangan domisili untuk keperluan administrasi.', requirements: ['Fotocopy KK', 'Fotocopy KTP', 'Surat pengantar RT/RW'], color: 'blue' },
    { title: 'Surat Keterangan Bepergian', description: 'Pengajuan surat keterangan bepergian untuk keperluan perjalanan.', requirements: ['Fotocopy KK', 'Fotocopy KTP', 'Surat pengantar RT/RW'], color: 'green' },
    { title: 'Surat Keterangan Belum Pernah Menikah', description: 'Pengajuan surat keterangan belum pernah menikah untuk keperluan administrasi.', requirements: ['Fotocopy KK', 'Fotocopy KTP', 'Surat pengantar RT/RW'], color: 'pink' },
    { title: 'Surat Keterangan Usaha', description: 'Pengajuan surat keterangan usaha untuk keperluan legalitas usaha.', requirements: ['Fotocopy KK', 'Fotocopy KTP', 'Surat pengantar RT/RW', 'Foto lokasi usaha'], color: 'purple' },
    { title: 'Surat Keterangan Ahli Waris', description: 'Pengajuan surat keterangan ahli waris untuk keperluan administrasi warisan.', requirements: ['Fotocopy KK', 'Fotocopy KTP almarhum', 'Fotocopy KTP ahli waris', 'Surat pengantar RT/RW'], color: 'indigo' },
    { title: 'Surat Keterangan Kelahiran', description: 'Pengajuan surat keterangan kelahiran untuk keperluan administrasi kependudukan.', requirements: ['Fotocopy KK', 'Surat keterangan lahir dari bidan/rumah sakit', 'Surat pengantar RT/RW'], color: 'yellow' },
    { title: 'Surat Pengantar Pernikahan', description: 'Pengajuan surat pengantar pernikahan untuk keperluan administrasi pernikahan.', requirements: ['Fotocopy KK', 'Fotocopy KTP', 'Surat pengantar RT/RW', 'Surat keterangan belum menikah'], color: 'rose' },
    { title: 'Surat Pengantar E-KTP', description: 'Pengajuan surat pengantar E-KTP untuk keperluan pembuatan atau pembaruan E-KTP.', requirements: ['Fotocopy KK', 'Surat pengantar RT/RW', 'Fotocopy KTP lama (jika perpanjangan)'], color: 'cyan' },
    { title: 'Surat Pengantar Kartu Keluarga', description: 'Pengajuan surat pengantar Kartu Keluarga untuk keperluan pembuatan atau pembaruan KK.', requirements: ['Fotocopy KK lama', 'Surat pengantar RT/RW', 'Dokumen pendukung perubahan'], color: 'orange' },
    { title: 'Surat Izin Keramaian', description: 'Pengajuan surat izin keramaian untuk keperluan penyelenggaraan acara.', requirements: ['Fotocopy KTP', 'Surat pengantar RT/RW', 'Proposal acara', 'Denah lokasi acara'], color: 'emerald' }
  ],
  jamPelayanan: [
    { day: 'Senin - Kamis', hours: '07:30 - 12:00 WITA', breakTime: 'Istirahat 12:00 - 13:00', afternoon: '13:00 - 16:00 WITA', isLibur: false },
    { day: 'Jumat', hours: '07:30 - 11:00 WITA', breakTime: 'Istirahat 11:00 - 14:00', afternoon: '14:00 - 16:30 WITA', isLibur: false },
    { day: 'Sabtu - Minggu', hours: '', breakTime: '', afternoon: '', isLibur: true }
  ]
}

// Color options for layanan
const COLOR_OPTIONS = [
  { value: 'red', label: 'Merah', bg: 'bg-red-100', text: 'text-red-600' },
  { value: 'blue', label: 'Biru', bg: 'bg-blue-100', text: 'text-blue-600' },
  { value: 'green', label: 'Hijau', bg: 'bg-green-100', text: 'text-green-600' },
  { value: 'yellow', label: 'Kuning', bg: 'bg-yellow-100', text: 'text-yellow-600' },
  { value: 'purple', label: 'Ungu', bg: 'bg-purple-100', text: 'text-purple-600' },
  { value: 'pink', label: 'Pink', bg: 'bg-pink-100', text: 'text-pink-600' },
  { value: 'indigo', label: 'Indigo', bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { value: 'orange', label: 'Oranye', bg: 'bg-orange-100', text: 'text-orange-600' },
  { value: 'teal', label: 'Teal', bg: 'bg-teal-100', text: 'text-teal-600' },
  { value: 'cyan', label: 'Cyan', bg: 'bg-cyan-100', text: 'text-cyan-600' },
  { value: 'rose', label: 'Mawar', bg: 'bg-rose-100', text: 'text-rose-600' },
  { value: 'emerald', label: 'Zamrud', bg: 'bg-emerald-100', text: 'text-emerald-600' },
  { value: 'gray', label: 'Abu-abu', bg: 'bg-gray-100', text: 'text-gray-600' }
]

const getColorClasses = (color) => {
  const found = COLOR_OPTIONS.find(c => c.value === color)
  return found || COLOR_OPTIONS[1]
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])
  const styles = { success: 'bg-green-50 border-green-200 text-green-800', error: 'bg-red-50 border-red-200 text-red-800' }
  const icons = { success: <FiCheck className="w-5 h-5 text-green-600" />, error: <FiAlertCircle className="w-5 h-5 text-red-600" /> }
  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border shadow-lg ${styles[type]}`}>
      {icons[type]}
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100">✕</button>
    </div>
  )
}

// ─── Tab Button ───────────────────────────────────────────────────────────────
function TabBtn({ id, label, icon: Icon, active, onClick, count }) {
  return (
    <button onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${active ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      {count !== undefined && (
        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>{count}</span>
      )}
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

// ─── TAB 1: Alur Pelayanan ────────────────────────────────────────────────────
function AlurTab({ steps, onChange }) {
  const updateStep = (i, field, val) => {
    const next = steps.map((s, idx) => idx === i ? { ...s, [field]: val } : s)
    onChange(next)
  }
  const addStep = () => onChange([...steps, { title: 'Step Baru', description: 'Deskripsi step', color: 'blue' }])
  const removeStep = (i) => {
    if (steps.length <= 2) return
    onChange(steps.filter((_, idx) => idx !== i))
  }
  const moveStep = (i, dir) => {
    const next = [...steps]
    const target = i + dir
    if (target < 0 || target >= next.length) return
    ;[next[i], next[target]] = [next[target], next[i]]
    onChange(next)
  }

  return (
    <div className="space-y-5">
      <SectionHeader icon={FaClipboardList} title="Alur Pelayanan" description="Edit urutan dan deskripsi setiap langkah dalam alur pelayanan" />

      {/* Preview bar */}
      <div className="hidden lg:flex items-center gap-2 p-4 bg-slate-50 rounded-xl overflow-x-auto">
        {steps.map((s, i) => {
          const c = getColorClasses(s.color)
          return (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <div className={`${c.bg} ${c.text} px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap`}>{s.title}</div>
              {i < steps.length - 1 && <span className="text-slate-300 text-lg">→</span>}
            </div>
          )
        })}
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => {
          const c = getColorClasses(step.color)
          return (
            <div key={i} className="flex gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all">
              {/* Number */}
              <div className={`flex-shrink-0 w-9 h-9 ${c.bg} ${c.text} rounded-full flex items-center justify-center font-bold text-sm`}>{i + 1}</div>

              {/* Fields */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Nama Step</label>
                  <input value={step.title} onChange={e => updateStep(i, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition placeholder:text-slate-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Deskripsi</label>
                  <input value={step.description} onChange={e => updateStep(i, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition placeholder:text-slate-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Warna</label>
                  <select value={step.color} onChange={e => updateStep(i, 'color', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition bg-white">
                    {COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button onClick={() => moveStep(i, -1)} disabled={i === 0} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg disabled:opacity-20 transition" title="Naikan">
                  <FiChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => moveStep(i, 1)} disabled={i === steps.length - 1} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg disabled:opacity-20 transition" title="Turunkan">
                  <FiChevronDown className="w-4 h-4" />
                </button>
                <button onClick={() => removeStep(i)} disabled={steps.length <= 2} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-20 transition" title="Hapus">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <button onClick={addStep}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-all">
        <FiPlus className="w-4 h-4" /> Tambah Step Baru
      </button>
    </div>
  )
}

// ─── TAB 2: Jenis Pelayanan ───────────────────────────────────────────────────
function JenisTab({ items, onChange }) {
  const [expandedIdx, setExpandedIdx] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const updateItem = (i, field, val) => {
    const next = items.map((item, idx) => idx === i ? { ...item, [field]: val } : item)
    onChange(next)
  }
  const addReq = (i) => {
    const reqs = [...items[i].requirements, '']
    updateItem(i, 'requirements', reqs)
  }
  const updateReq = (i, ri, val) => {
    const reqs = items[i].requirements.map((r, idx) => idx === ri ? val : r)
    updateItem(i, 'requirements', reqs)
  }
  const removeReq = (i, ri) => {
    const reqs = items[i].requirements.filter((_, idx) => idx !== ri)
    updateItem(i, 'requirements', reqs)
  }
  const addItem = () => {
    onChange([...items, { title: 'Layanan Baru', description: 'Deskripsi layanan baru', requirements: ['Fotocopy KTP'], color: 'blue' }])
    setExpandedIdx(items.length)
  }
  const removeItem = (i) => {
    if (!confirm('Yakin ingin menghapus layanan ini?')) return
    onChange(items.filter((_, idx) => idx !== i))
    if (expandedIdx === i) setExpandedIdx(null)
  }

  const filtered = items.map((item, i) => ({ ...item, _idx: i }))
    .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-5">
      <SectionHeader icon={FaFileAlt} title="Jenis Pelayanan" description="Tambah, edit, atau hapus jenis layanan yang tersedia. Klik item untuk expand dan edit." />

      {/* Search + Add */}
      <div className="flex gap-3">
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Cari jenis layanan..."
          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition placeholder:text-slate-500" />
        <button onClick={addItem}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-blue-600 rounded-xl hover:from-green-700 hover:to-blue-700 shadow-sm transition-all">
          <FiPlus className="w-4 h-4" /> Tambah Layanan
        </button>
      </div>

      <p className="text-xs text-slate-400">{items.length} layanan terdaftar{searchTerm && ` · ${filtered.length} hasil pencarian`}</p>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((item) => {
          const i = item._idx
          const c = getColorClasses(item.color)
          const isOpen = expandedIdx === i
          return (
            <div key={i} className={`border rounded-xl overflow-hidden transition-all ${isOpen ? 'border-green-200 shadow-md' : 'border-slate-100 hover:border-slate-200'}`}>
              {/* Header row */}
              <div className="flex items-center gap-3 p-4 cursor-pointer bg-white" onClick={() => setExpandedIdx(isOpen ? null : i)}>
                <div className={`w-9 h-9 ${c.bg} ${c.text} rounded-xl flex items-center justify-center flex-shrink-0 text-lg`}>
                  📄
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.requirements.length} persyaratan</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); removeItem(i) }}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                  {isOpen ? <FiChevronUp className="w-4 h-4 text-slate-400" /> : <FiChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Expanded editor */}
              {isOpen && (
                <div className="p-4 pt-0 bg-slate-50 space-y-4 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Nama Layanan</label>
                      <input value={item.title} onChange={e => updateItem(i, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition placeholder:text-slate-500" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Warna Ikon</label>
                      <select value={item.color} onChange={e => updateItem(i, 'color', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition">
                        {COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Deskripsi</label>
                      <textarea value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} rows={2}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none placeholder:text-slate-500" />
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">Persyaratan ({item.requirements.length} item)</label>
                    <div className="space-y-2">
                      {item.requirements.map((req, ri) => (
                        <div key={ri} className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{ri + 1}</span>
                          <input value={req} onChange={e => updateReq(i, ri, e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition placeholder:text-slate-500" />
                          <button onClick={() => removeReq(i, ri)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => addReq(i)}
                        className="flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 py-2">
                        <FiPlus className="w-3.5 h-3.5" /> Tambah persyaratan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <FaFileAlt className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Tidak ada layanan ditemukan</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── TAB 3: Jam Pelayanan ─────────────────────────────────────────────────────
function JamTab({ items, onChange }) {
  const updateItem = (i, field, val) => {
    const next = items.map((item, idx) => idx === i ? { ...item, [field]: val } : item)
    onChange(next)
  }
  const addItem = () => onChange([...items, { day: 'Hari Baru', hours: '08:00 - 16:00 WITA', breakTime: '', afternoon: '', isLibur: false }])
  const removeItem = (i) => {
    if (items.length <= 1) return
    onChange(items.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-5">
      <SectionHeader icon={FaClock} title="Jam Pelayanan" description="Edit jadwal hari dan jam operasional kantor kelurahan" />

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className={`p-4 border rounded-xl bg-white shadow-sm ${item.isLibur ? 'border-red-100 bg-red-50/30' : 'border-slate-100'}`}>
            <div className="flex items-start gap-4">
              {/* Libur badge */}
              <div className="flex-shrink-0 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={item.isLibur} onChange={e => updateItem(i, 'isLibur', e.target.checked)}
                    className="w-4 h-4 rounded accent-red-500" />
                  <span className={`text-xs font-semibold ${item.isLibur ? 'text-red-600' : 'text-slate-400'}`}>Libur</span>
                </label>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Nama Hari</label>
                  <input value={item.day} onChange={e => updateItem(i, 'day', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition placeholder:text-slate-500" />
                </div>
                {!item.isLibur && (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Jam Pagi</label>
                      <input value={item.hours} onChange={e => updateItem(i, 'hours', e.target.value)}
                        placeholder="07:30 - 12:00 WITA"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition placeholder:text-slate-500" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Keterangan Istirahat</label>
                      <input value={item.breakTime} onChange={e => updateItem(i, 'breakTime', e.target.value)}
                        placeholder="Istirahat 12:00 - 13:00"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition placeholder:text-slate-500" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Jam Sore</label>
                      <input value={item.afternoon} onChange={e => updateItem(i, 'afternoon', e.target.value)}
                        placeholder="13:00 - 16:00 WITA"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition placeholder:text-slate-500" />
                    </div>
                  </>
                )}
                {item.isLibur && (
                  <div className="sm:col-span-3 flex items-center">
                    <span className="text-red-400 text-sm font-medium italic">Hari ini libur — tidak ada jam operasional</span>
                  </div>
                )}
              </div>

              <button onClick={() => removeItem(i)} disabled={items.length <= 1}
                className="flex-shrink-0 mt-1 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-20 transition">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addItem}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-all">
        <FiPlus className="w-4 h-4" /> Tambah Jadwal Hari
      </button>

      {/* Preview */}
      <div className="p-4 bg-slate-50 rounded-xl">
        <p className="text-xs font-semibold text-slate-500 mb-3">Preview Jam Pelayanan:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {items.map((item, i) => (
            <div key={i} className={`p-3 rounded-lg text-xs ${item.isLibur ? 'bg-red-50 border border-red-100' : 'bg-white border border-slate-100'}`}>
              <p className="font-semibold text-slate-700">{item.day}</p>
              {item.isLibur ? (
                <p className="text-red-500 mt-1">Libur</p>
              ) : (
                <div className="mt-1 space-y-0.5 text-slate-500">
                  <p>{item.hours}</p>
                  {item.breakTime && <p className="italic">{item.breakTime}</p>}
                  {item.afternoon && <p>{item.afternoon}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminLayanan() {
  const [activeTab, setActiveTab] = useState('alur')
  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const snap = await getDoc(doc(db, 'layanan', 'konten'))
      if (snap.exists()) {
        const data = snap.data()
        setFormData({
          alurPelayanan: data.alurPelayanan?.length ? data.alurPelayanan : DEFAULT_DATA.alurPelayanan,
          jenisPelayanan: data.jenisPelayanan?.length ? data.jenisPelayanan : DEFAULT_DATA.jenisPelayanan,
          jamPelayanan: data.jamPelayanan?.length ? data.jamPelayanan : DEFAULT_DATA.jamPelayanan
        })
      } else {
        setFormData(JSON.parse(JSON.stringify(DEFAULT_DATA)))
      }
    } catch (err) {
      console.error(err)
      setFormData(JSON.parse(JSON.stringify(DEFAULT_DATA)))
      setToast({ message: 'Gagal memuat data, menggunakan default.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, 'layanan', 'konten'), { ...formData, updatedAt: serverTimestamp() })
      setToast({ message: 'Data layanan berhasil disimpan!', type: 'success' })
    } catch (err) {
      console.error(err)
      setToast({ message: 'Gagal menyimpan. Coba lagi.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <RequireAuth><AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4 text-slate-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
            <p className="text-sm">Memuat data layanan...</p>
          </div>
        </div>
      </AdminLayout></RequireAuth>
    )
  }

  const tabs = [
    { id: 'alur', label: 'Alur Pelayanan', icon: FiGitMerge, count: formData?.alurPelayanan?.length },
    { id: 'jenis', label: 'Jenis Pelayanan', icon: FiList, count: formData?.jenisPelayanan?.length },
    { id: 'jam', label: 'Jam Pelayanan', icon: FiClock, count: formData?.jamPelayanan?.length }
  ]

  return (
    <RequireAuth><AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-1">Kelola Layanan Publik</h1>
            <p className="text-slate-500 text-sm">Edit alur, jenis layanan, dan jam operasional</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-blue-600 rounded-xl hover:from-green-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-60">
              {saving ? <><FiLoader className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><FiSave className="w-4 h-4" /> Simpan Perubahan</>}
            </button>
          </div>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-sm">
          <FiInfo className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>Perubahan yang disimpan akan langsung tampil di halaman publik <strong>/layanan</strong>. Tekan Simpan setelah selesai edit semua bagian.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map(t => <TabBtn key={t.id} id={t.id} label={t.label} icon={t.icon} active={activeTab === t.id} onClick={setActiveTab} count={t.count} />)}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:p-8">
          {activeTab === 'alur' && formData && (
            <AlurTab steps={formData.alurPelayanan} onChange={v => setFormData(p => ({ ...p, alurPelayanan: v }))} />
          )}
          {activeTab === 'jenis' && formData && (
            <JenisTab items={formData.jenisPelayanan} onChange={v => setFormData(p => ({ ...p, jenisPelayanan: v }))} />
          )}
          {activeTab === 'jam' && formData && (
            <JamTab items={formData.jamPelayanan} onChange={v => setFormData(p => ({ ...p, jamPelayanan: v }))} />
          )}
        </div>

        {/* Bottom save */}
        <div className="flex justify-end pt-2">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-blue-600 rounded-xl hover:from-green-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-60">
            {saving ? <><FiLoader className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><FiSave className="w-4 h-4" /> Simpan Semua Perubahan</>}
          </button>
        </div>
      </div>
    </AdminLayout></RequireAuth>
  )
}
