import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Function to generate slug from title
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-') // Remove leading/trailing hyphens
}

// Function to check if slug exists
export async function checkSlugExists(slug, excludeId = null) {
  const { collection, query, where, getDocs } = await import('firebase/firestore')
  const q = query(collection(db, 'berita'), where('slug', '==', slug))
  const querySnapshot = await getDocs(q)
  
  if (excludeId) {
    // Exclude current document when editing
    return querySnapshot.docs.some(doc => doc.id !== excludeId)
  }
  
  return !querySnapshot.empty
}

// Function to generate unique slug
export async function generateUniqueSlug(title, excludeId = null) {
  let baseSlug = generateSlug(title)
  let slug = baseSlug
  let counter = 1
  
  while (await checkSlugExists(slug, excludeId)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  
  return slug
}
