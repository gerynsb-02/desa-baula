// lib/uploadImage.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "./firebase"

export async function uploadImage(file, folder = 'berita') {
  if (!file) throw new Error("File tidak ditemukan")

  const filename = `${folder}/${Date.now()}_${file.name}`
  const imageRef = ref(storage, filename)

  await uploadBytes(imageRef, file)
  const downloadURL = await getDownloadURL(imageRef)

  // Kembalikan URL dan path (untuk keperluan delete nanti)
  return {
    url: downloadURL,
    path: filename, // ← ini yang nanti dipakai untuk delete dari storage
  }
}
