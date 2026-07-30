#!/usr/bin/env node

// Script otomatis untuk setup Firebase config
// Jalankan dengan: node auto-setup.js

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔧 Auto Setup Firebase Config')
console.log('==============================\n')

// Cek file .env di root project
const rootDir = path.join(__dirname, '..')
const envFiles = ['.env.local', '.env', '.env.example']

let envContent = null
let envFile = null

for (const file of envFiles) {
  const envPath = path.join(rootDir, file)
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8')
    envFile = file
    break
  }
}

if (!envContent) {
  console.log('❌ File .env tidak ditemukan!')
  console.log('Cari file dengan nama: .env.local, .env, atau .env.example')
  console.log('\n📝 Buat file .env.local di root project dengan isi:')
  console.log(`
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
  `)
  process.exit(1)
}

console.log(`✅ Ditemukan file: ${envFile}`)

// Parse .env content
const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

// Cek apakah semua variabel Firebase ada
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
]

const missingVars = requiredVars.filter(varName => !envVars[varName])

if (missingVars.length > 0) {
  console.log('❌ Variabel Firebase yang hilang:')
  missingVars.forEach(varName => console.log(`   - ${varName}`))
  console.log('\n📝 Tambahkan variabel yang hilang ke file .env')
  process.exit(1)
}

console.log('✅ Semua variabel Firebase ditemukan')

// Generate firebase-config.js content
const configContent = `// Konfigurasi Firebase untuk script migrasi
// Auto-generated dari file ${envFile}

export const firebaseConfig = {
  apiKey: "${envVars.NEXT_PUBLIC_FIREBASE_API_KEY}",
  authDomain: "${envVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}",
  projectId: "${envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID}",
  storageBucket: "${envVars.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${envVars.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${envVars.NEXT_PUBLIC_FIREBASE_APP_ID}"
}
`

// Tulis ke firebase-config.js
const configPath = path.join(__dirname, 'firebase-config.js')
fs.writeFileSync(configPath, configContent)

console.log('✅ firebase-config.js berhasil dibuat!')
console.log('\n📋 Konfigurasi yang dibuat:')
console.log(`   Project ID: ${envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`)
console.log(`   Auth Domain: ${envVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`)
console.log(`   Storage Bucket: ${envVars.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}`)

console.log('\n🚀 Sekarang Anda bisa menjalankan migrasi:')
console.log('   npm install')
console.log('   npm run migrate') 