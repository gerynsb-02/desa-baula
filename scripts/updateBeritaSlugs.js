// Script untuk mengupdate berita yang sudah ada dengan slug
// Jalankan dengan: node scripts/updateBeritaSlugs.js

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { firebaseConfig } from './firebase-config.js'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-') // Remove leading/trailing hyphens
}

// Function to generate unique slug
async function generateUniqueSlug(title, existingSlugs) {
  let baseSlug = generateSlug(title)
  let slug = baseSlug
  let counter = 1
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  
  return slug
}

async function updateBeritaSlugs() {
  try {
    console.log('Mulai mengupdate slug berita...')
    
    // Get all berita documents
    const querySnapshot = await getDocs(collection(db, 'berita'))
    const beritaList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    console.log(`Ditemukan ${beritaList.length} berita`)
    
    const existingSlugs = []
    const updates = []
    
    // Generate slugs for all berita
    for (const berita of beritaList) {
      if (!berita.slug) {
        const slug = await generateUniqueSlug(berita.judul, existingSlugs)
        existingSlugs.push(slug)
        
        updates.push({
          id: berita.id,
          slug: slug
        })
        
        console.log(`Berita: "${berita.judul}" -> Slug: "${slug}"`)
      } else {
        existingSlugs.push(berita.slug)
        console.log(`Berita: "${berita.judul}" sudah memiliki slug: "${berita.slug}"`)
      }
    }
    
    // Update documents in batches
    console.log(`\nMengupdate ${updates.length} berita...`)
    
    for (const update of updates) {
      const docRef = doc(db, 'berita', update.id)
      await updateDoc(docRef, { slug: update.slug })
      console.log(`✓ Updated: ${update.id} -> ${update.slug}`)
    }
    
    console.log('\n✅ Selesai mengupdate semua slug berita!')
    
  } catch (error) {
    console.error('Error updating berita slugs:', error)
  }
}

// Run the script
updateBeritaSlugs() 