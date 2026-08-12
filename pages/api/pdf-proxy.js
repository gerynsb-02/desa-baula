// pages/api/pdf-proxy.js
// Proxy PDF menggunakan Node.js https module (lebih reliable daripada fetch di API routes)

import https from 'https'
import http from 'http'

export default function handler(req, res) {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({ error: 'Parameter URL diperlukan' })
  }

  const decodedUrl = decodeURIComponent(url)

  // Security: hanya izinkan URL dari Cloudinary
  if (!decodedUrl.includes('cloudinary.com')) {
    return res.status(403).json({ error: 'URL tidak diizinkan' })
  }

  const protocol = decodedUrl.startsWith('https') ? https : http

  const fetchPdf = (targetUrl) => {
    protocol.get(
      targetUrl,
      {
        headers: {
          'Accept': 'application/pdf, application/octet-stream, */*',
          'User-Agent': 'Mozilla/5.0 (Node.js PDF Proxy)',
        },
      },
      (proxyRes) => {
        // Ikuti redirect (301/302)
        if (
          proxyRes.statusCode >= 300 &&
          proxyRes.statusCode < 400 &&
          proxyRes.headers.location
        ) {
          return fetchPdf(proxyRes.headers.location)
        }

        if (proxyRes.statusCode !== 200) {
          console.error(`Cloudinary returned HTTP ${proxyRes.statusCode} for: ${targetUrl}`)
          return res
            .status(proxyRes.statusCode)
            .json({ error: `Cloudinary error: HTTP ${proxyRes.statusCode}` })
        }

        // Set header agar browser render inline (bukan download)
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'inline; filename="document.pdf"')
        res.setHeader('Cache-Control', 'public, max-age=3600')
        res.setHeader('Access-Control-Allow-Origin', '*')

        if (proxyRes.headers['content-length']) {
          res.setHeader('Content-Length', proxyRes.headers['content-length'])
        }

        // Stream PDF langsung ke browser
        proxyRes.pipe(res)

        proxyRes.on('error', (err) => {
          console.error('Stream error:', err)
        })
      }
    ).on('error', (err) => {
      console.error('HTTPS request error:', err.message)
      if (!res.headersSent) {
        res.status(500).json({ error: 'Gagal terhubung ke Cloudinary', detail: err.message })
      }
    })
  }

  fetchPdf(decodedUrl)
}
