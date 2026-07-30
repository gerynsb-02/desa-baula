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
        <meta property="og:site_name" content="Desa Baula" />
        <meta property="og:locale" content="id_ID" />
        
        {/* Twitter Card Default */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@desa_baula" />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentOrganization",
              "name": "Desa Baula",
              "description": "Website resmi Desa Baula - Informasi layanan, berita, dan profil desa",
              "url": "https://desa-baula.id",
              "logo": "https://desa-baula.id/images/logo.png",
              "image": "https://desa-baula.id/images/header.jpg",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Baula",
                "addressRegion": "Sulawesi Selatan",
                "addressCountry": "ID"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "Indonesian"
              },
              "sameAs": []
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
