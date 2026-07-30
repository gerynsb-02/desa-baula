import Navbar from './Navbar'
import Footer from './Footer'
import Head from 'next/head'

export default function Layout({ children, title, description, keywords, image, url, type = 'website' }) {
  const siteName = 'Kelurahan Balleangin'
  const fullTitle = title ? `${title} - ${siteName}` : siteName
  const defaultDescription = 'Website resmi Kelurahan Balleangin - Informasi layanan, berita, dan profil kelurahan terbaru'
  const defaultImage = '/images/header.jpg'
  const defaultUrl = 'https://kelurahan-balleangin.online'
  
  // Ensure image URL is absolute
  const getAbsoluteImageUrl = (imageUrl) => {
    if (!imageUrl) return `${defaultUrl}${defaultImage}`
    if (imageUrl.startsWith('http')) return imageUrl
    if (imageUrl.startsWith('/')) return `${defaultUrl}${imageUrl}`
    return `${defaultUrl}/${imageUrl}`
  }
  
  const ogImage = getAbsoluteImageUrl(image)
  const ogUrl = url ? (url.startsWith('http') ? url : `${defaultUrl}${url}`) : defaultUrl

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{fullTitle}</title>
        <meta name="description" content={description || defaultDescription} />
        <meta name="keywords" content={keywords || 'kelurahan balleangin, balleangin, pangkep, pemerintah desa, layanan publik, berita kelurahan, profil kelurahan, sulawesi selatan'} />
        <meta name="author" content="Kelurahan Balleangin" />
        <meta name="robots" content="index, follow" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={ogUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description || defaultDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={title || siteName} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:type" content={type} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content="id_ID" />
        
        {/* WhatsApp specific meta tags */}
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:secure_url" content={ogImage} />
        
        {/* Additional meta tags for better compatibility */}
        <meta name="description" content={description || defaultDescription} />
        <meta name="image" content={ogImage} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description || defaultDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={title || siteName} />
        <meta name="twitter:site" content="@kelurahan_balleangin" />
        
        {/* Additional Meta Tags */}
        <meta name="application-name" content={siteName} />
        <meta name="apple-mobile-web-app-title" content={siteName} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Mobile Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Performance */}
        <link rel="preload" href="/images/logo.png" as="image" />
        <link rel="preload" href="/images/header.jpg" as="image" />
      </Head>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
