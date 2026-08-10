import Navbar from './Navbar'
import Footer from './Footer'
import Head from 'next/head'

export default function Layout({ children, title, description, keywords, image, url, type = 'website' }) {
  const siteName = 'Kelurahan Baula'
  const fullTitle = title ? `${title} - ${siteName}` : siteName
  const defaultDescription = 'Website resmi Kelurahan Baula - Informasi layanan publik, berita terkini, dan profil kelurahan Baula, Sulawesi Selatan'
  const defaultImage = '/images/header.jpg'
  const defaultUrl = 'https://desabaula.site'
  
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
        <meta name="keywords" content={keywords || 'kelurahan baula, kelurahan baula, desabaula.site, pemerintah kelurahan baula, layanan publik baula, berita baula, profil kelurahan baula, sulawesi selatan, sulsel'} />
        <meta name="author" content="Kelurahan Baula" />
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
        <meta name="twitter:site" content="@desa_baula" />
        
        {/* Additional Meta Tags */}
        <meta name="application-name" content={siteName} />
        <meta name="apple-mobile-web-app-title" content={siteName} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Mobile Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        {/* Geo / Local SEO */}
        <meta name="geo.region" content="ID-SN" />
        <meta name="geo.placename" content="Kelurahan Baula, Sulawesi Selatan" />
        <meta name="geo.position" content="-4.0;120.5" />
        <meta name="ICBM" content="-4.0, 120.5" />
        <meta name="language" content="Indonesian" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />

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
