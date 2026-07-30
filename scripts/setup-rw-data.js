const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample RW data
const rwData = [
  { nama: 'RW 001', lokasi: 'Tompo Balang', total_penduduk: 245 },
  { nama: 'RW 002', lokasi: 'Tumbue', total_penduduk: 312 },
  { nama: 'RW 003', lokasi: 'Senggerang', total_penduduk: 198 },
  { nama: 'RW 004', lokasi: 'Demanggala', total_penduduk: 267 },
  { nama: 'RW 005', lokasi: "Ce'lae", total_penduduk: 189 },
  { nama: 'RW 006', lokasi: 'Bonto-bonto', total_penduduk: 223 }
];

async function setupRWData() {
  try {
    console.log('🚀 Memulai setup data RW...');
    
    // Clear existing RW data
    const existingDocs = await getDocs(collection(db, 'data_rw'));
    const deletePromises = existingDocs.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log('✅ Data RW lama berhasil dihapus');
    
    // Add new RW data
    const addPromises = rwData.map(async (rw) => {
      await addDoc(collection(db, 'data_rw'), {
        ...rw,
        created_at: new Date(),
        updated_at: new Date()
      });
    });
    
    await Promise.all(addPromises);
    console.log('✅ Data RW berhasil ditambahkan:', rwData.length, 'RW');
    
    console.log('🎉 Setup data RW selesai!');
    console.log('\nData RW yang ditambahkan:');
    rwData.forEach((rw, index) => {
                      console.log(`${index + 1}. ${rw.nama} - ${rw.lokasi} (${rw.total_penduduk || 'Data tidak tersedia'} penduduk)`);
    });
    
  } catch (error) {
    console.error('❌ Error saat setup data RW:', error);
  }
}

// Run the setup
setupRWData(); 