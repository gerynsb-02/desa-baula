import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../lib/firebase'

const SITE_URL = 'https://desabaula.site'

function generateSiteMap(pages, beritaList) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static Pages -->
     ${pages
       .map((page) => {
         return `
       <url>
           <loc>${`${SITE_URL}${page}`}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>${page === '/' ? '1.0' : '0.8'}</priority>
       </url>
     `
       })
       .join('')}
     
     <!-- Dynamic Berita Pages -->
     ${beritaList
       .map((berita) => {
         return `
       <url>
           <loc>${`${SITE_URL}/berita/${berita.slug || berita.id}`}</loc>
           <lastmod>${berita.tanggal?.toDate?.()?.toISOString() || new Date().toISOString()}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.6</priority>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

function SiteMap() {
  // getServerSideProps will handle the XML generation
}

export async function getServerSideProps({ res }) {
  try {
    // Fetch berita data
    const beritaQuery = query(collection(db, 'berita'), orderBy('tanggal', 'desc'))
    const beritaSnapshot = await getDocs(beritaQuery)
    const beritaList = beritaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // Static pages
    const pages = [
      '/',
      '/berita',
      '/profil',
      '/galeri',
      '/layanan',
      '/potensi',
      '/data'
    ]

    // Generate the XML sitemap
    const sitemap = generateSiteMap(pages, beritaList)

    res.setHeader('Content-Type', 'text/xml')
    res.write(sitemap)
    res.end()

    return {
      props: {},
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Fallback sitemap with static pages only
    const pages = [
      '/',
      '/berita',
      '/profil',
      '/galeri',
      '/layanan',
      '/potensi',
      '/data'
    ]
    
    const sitemap = generateSiteMap(pages, [])
    
    res.setHeader('Content-Type', 'text/xml')
    res.write(sitemap)
    res.end()

    return {
      props: {},
    }
  }
}

export default SiteMap 