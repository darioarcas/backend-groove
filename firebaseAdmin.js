// backend/firebaseAdmin.js
const admin = require('firebase-admin');

let serviceAccount;

// Verificamos si ya está inicializado
if (admin.apps.length === 0) {  // Si no existe ninguna app de Firebase
  console.log("🔥 Inicializando Firebase...");

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log("🔥 Firebase Service Account cargado");
  } else {
    console.log("❌ No se encuentra la variable de entorno FIREBASE_SERVICE_ACCOUNT");
    throw new Error('FIREBASE_SERVICE_ACCOUNT no está definido en las variables de entorno');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  console.log('🔥 Firebase ya estaba inicializado');
}

const db = admin.firestore();  // Esto ahora debería estar inicializado correctamente
module.exports = { admin, db };




