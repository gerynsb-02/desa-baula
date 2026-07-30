import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/images/logo.png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Meta Tags */}
        <meta charSet="utf-8" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#16a34a" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        
        {/* Open Graph Default */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Kelurahan Balleangin" />
        <meta property="og:locale" content="id_ID" />
        
        {/* Twitter Card Default */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@kelurahan_balleangin" />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentOrganization",
              "name": "Kelurahan Balleangin",
              "description": "Website resmi Kelurahan Balleangin - Informasi layanan, berita, dan profil kelurahan",
              "url": "https://kelurahan-balleangin.online",
              "logo": "https://kelurahan-balleangin.online/images/logo.png",
              "image": "https://kelurahan-balleangin.online/images/header.jpg",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Balleangin",
                "addressRegion": "Sulawesi Selatan",
                "addressCountry": "ID"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "Indonesian"
              },
              "sameAs": [
                "https://facebook.com/balleangin",
                "https://instagram.com/balleangin"
              ]
            })
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
