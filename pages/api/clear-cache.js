export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html')
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Clear Cache - Desa Baula</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .button:hover { background: #0056b3; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>Clear Cache untuk WhatsApp/Facebook</h1>
      
      <div class="section">
        <h2>1. Facebook Debugger</h2>
        <p>Gunakan Facebook Debugger untuk clear cache dan test preview:</p>
        <a href="https://developers.facebook.com/tools/debug/" target="_blank" class="button">Facebook Debugger</a>
        <p>Masukkan URL: <strong>https://desa-baula.online/berita/mahasiswa-kkn-unhas-serahkan-website-resmi-dan-latih-perangkat-desa-baula</strong></p>
      </div>

      <div class="section">
        <h2>2. Twitter Card Validator</h2>
        <p>Test Twitter Card preview:</p>
        <a href="https://cards-dev.twitter.com/validator" target="_blank" class="button">Twitter Card Validator</a>
      </div>

      <div class="section">
        <h2>3. LinkedIn Post Inspector</h2>
        <p>Test LinkedIn preview:</p>
        <a href="https://www.linkedin.com/post-inspector/" target="_blank" class="button">LinkedIn Post Inspector</a>
      </div>

      <div class="section">
        <h2>4. WhatsApp Test</h2>
        <p>Copy URL ini dan paste di WhatsApp:</p>
        <p><strong>https://desa-baula.online/berita/mahasiswa-kkn-unhas-serahkan-website-resmi-dan-latih-perangkat-desa-baula</strong></p>
        <p>Jika masih menampilkan preview lama, coba:</p>
        <ul>
          <li>Restart WhatsApp</li>
          <li>Clear cache WhatsApp</li>
          <li>Tunggu beberapa menit (cache bisa bertahan 24 jam)</li>
        </ul>
      </div>

      <div class="section">
        <h2>5. Test URL</h2>
        <p>Test dengan URL ini untuk memastikan meta tags bekerja:</p>
        <a href="https://desa-baula.online/api/test-whatsapp" target="_blank" class="button">Test WhatsApp Preview</a>
      </div>
    </body>
    </html>
  `)
}
