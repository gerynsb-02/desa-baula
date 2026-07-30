# 🔥 Setup Firebase untuk Script Migrasi

## Apa yang perlu dilakukan?

Script migrasi perlu mengakses database Firebase Anda untuk mengupdate berita dengan slug baru. Karena script ini berjalan di luar aplikasi Next.js, kita perlu membuat file konfigurasi terpisah.

## Langkah 1: Cek Konfigurasi Firebase Anda

Buka file `lib/firebase.js` dan lihat bagian ini:

```javascript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
```

## Langkah 2: Cek File .env

Buka file `.env.local` atau `.env` di root project Anda, dan cari nilai-nilai ini:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## Langkah 3: Buat firebase-config.js

1. **Salin file contoh:**
   ```bash
   cd scripts
   cp firebase-config.example.js firebase-config.js
   ```

2. **Edit firebase-config.js** dan ganti dengan nilai dari file .env Anda:

   ```javascript
   export const firebaseConfig = {
     apiKey: "nilai-dari-NEXT_PUBLIC_FIREBASE_API_KEY",
     authDomain: "nilai-dari-NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
     projectId: "nilai-dari-NEXT_PUBLIC_FIREBASE_PROJECT_ID",
     storageBucket: "nilai-dari-NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
     messagingSenderId: "nilai-dari-NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
     appId: "nilai-dari-NEXT_PUBLIC_FIREBASE_APP_ID"
   }
   ```

## Contoh Lengkap:

Jika di .env Anda ada:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-project-123
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-project-123.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=987654321
NEXT_PUBLIC_FIREBASE_APP_ID=1:987654321:web:abcdef123456789
```

Maka di `scripts/firebase-config.js` Anda tulis:
```javascript
export const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz",
  authDomain: "my-project.firebaseapp.com",
  projectId: "my-project-123",
  storageBucket: "my-project-123.appspot.com",
  messagingSenderId: "987654321",
  appId: "1:987654321:web:abcdef123456789"
}
```

## Mengapa .env di-disable?

File `.env` di-disable di `.gitignore` karena:
- **Keamanan**: Tidak ingin konfigurasi Firebase tersimpan di Git
- **Privasi**: Setiap developer bisa punya konfigurasi berbeda
- **Best Practice**: Konfigurasi sensitif tidak boleh di-commit

## Langkah 4: Jalankan Script

Setelah setup selesai:
```bash
cd scripts
npm install
npm run migrate
```

## Troubleshooting

**Jika tidak ada file .env:**
1. Cek di Firebase Console
2. Buka Project Settings
3. Scroll ke bawah ke "Your apps"
4. Klik "Web app" dan lihat konfigurasi

**Jika bingung nilai apa:**
- `apiKey`: String panjang yang dimulai dengan "AIza"
- `authDomain`: Nama project + ".firebaseapp.com"
- `projectId`: ID project Firebase Anda
- `storageBucket`: Nama project + ".appspot.com"
- `messagingSenderId`: Angka (biasanya 10-12 digit)
- `appId`: Format "1:angka:web:randomstring" 