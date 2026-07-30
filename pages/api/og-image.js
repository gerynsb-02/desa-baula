export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html')
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Test Artikel Berita - Kelurahan Balleangin</title>
      
      <!-- Basic Meta Tags -->
      <meta name="description" content="Ini adalah artikel test untuk memastikan preview gambar berita berfungsi dengan baik saat di-share di media sosial." />
      <meta name="keywords" content="test, berita, kelurahan balleangin" />
      <meta name="author" content="Kelurahan Balleangin" />
      
      <!-- Canonical URL -->
      <link rel="canonical" href="https://kelurahan-balleangin.online/api/og-image" />
      
      <!-- Open Graph Meta Tags -->
      <meta property="og:title" content="Test Artikel Berita - Kelurahan Balleangin" />
      <meta property="og:description" content="Ini adalah artikel test untuk memastikan preview gambar berita berfungsi dengan baik saat di-share di media sosial." />
      <meta property="og:image" content="https://kelurahan-balleangin.online/images/header.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Test Artikel Berita" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:secure_url" content="https://kelurahan-balleangin.online/images/header.jpg" />
      <meta property="og:url" content="https://kelurahan-balleangin.online/api/og-image" />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Kelurahan Balleangin" />
      <meta property="og:locale" content="id_ID" />
      
      <!-- Twitter Card Meta Tags -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Test Artikel Berita - Kelurahan Balleangin" />
      <meta name="twitter:description" content="Ini adalah artikel test untuk memastikan preview gambar berita berfungsi dengan baik saat di-share di media sosial." />
      <meta name="twitter:image" content="https://kelurahan-balleangin.online/images/header.jpg" />
      <meta name="twitter:image:alt" content="Test Artikel Berita" />
      
      <!-- Additional Meta Tags -->
      <meta name="image" content="https://kelurahan-balleangin.online/images/header.jpg" />
    </head>
    <body>
      <h1>Open Graph Test Page</h1>
      <p>Halaman ini digunakan untuk testing preview gambar saat di-share di media sosial.</p>
      <p>Silakan share URL ini di WhatsApp, Facebook, atau Twitter untuk melihat hasilnya.</p>
      <p><strong>URL untuk test:</strong> https://kelurahan-balleangin.online/api/og-image</p>
    </body>
    </html>
  `)
}
