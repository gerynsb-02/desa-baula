// pages/api/pdf-signed-url.js
// Generate signed Cloudinary URL untuk PDF agar bisa diakses publik
// Diperlukan karena akun ini membatasi akses raw files tanpa signature

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export default function handler(req, res) {
  const { publicId } = req.query

  if (!publicId) {
    return res.status(400).json({ error: 'publicId diperlukan' })
  }

  // Validasi: hanya izinkan publicId dari folder kita
  const decodedId = decodeURIComponent(publicId)
  if (!decodedId.startsWith('desa-baula/')) {
    return res.status(403).json({ error: 'Akses tidak diizinkan' })
  }

  try {
    // Generate signed URL yang valid 24 jam
    const signedUrl = cloudinary.url(decodedId, {
      resource_type: 'raw',
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 86400, // 24 jam
      secure: true,
    })

    // Redirect langsung ke signed URL
    // Browser akan membuka PDF langsung dari Cloudinary CDN
    res.redirect(302, signedUrl)
  } catch (err) {
    console.error('Signed URL error:', err)
    res.status(500).json({ error: 'Gagal generate URL', detail: err.message })
  }
}
