// pages/api/cloudinary/delete.js
// API route untuk menghapus file dari Cloudinary (server-side)
// Mendukung resource_type: 'image' (default) dan 'raw' (PDF, dokumen, dll)

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { publicId, resourceType } = req.body
  if (!publicId) {
    return res.status(400).json({ message: 'publicId diperlukan' })
  }

  try {
    // resource_type: 'image' untuk gambar, 'raw' untuk PDF/dokumen
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType === 'raw' ? 'raw' : 'image',
    })
    return res.status(200).json({ result })
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    return res.status(500).json({ message: 'Gagal menghapus file', error: error.message })
  }
}
