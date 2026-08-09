import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/images/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/logo.png" />
        <link rel="shortcut icon" href="/images/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/logo.png" />
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
        <meta name="msapplication-TileImage" content="/images/logo.png" />
        
        {/* Open Graph Default */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Desa Baula" />
        <meta property="og:locale" content="id_ID" />
        <meta property="og:image" content="https://desabaula.site/images/logo.png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:alt" content="Logo Desa Baula" />
        
        {/* Twitter Card Default */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@desa_baula" />
        <meta name="twitter:image" content="https://desabaula.site/images/logo.png" />
        <meta name="twitter:image:alt" content="Logo Desa Baula" />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentOrganization",
              "name": "Desa Baula",
              "description": "Website resmi Desa Baula - Informasi layanan publik, berita terkini, dan profil kelurahan Baula, Sulawesi Selatan",
              "url": "https://desabaula.site",
              "logo": "https://desabaula.site/images/logo.png",
              "image": "https://desabaula.site/images/header.jpg",
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
