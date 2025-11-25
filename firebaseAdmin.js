// backend/firebaseAdmin.js

const admin = require('firebase-admin');

let serviceAccount;
console.log('FIREBASE_SERVICE_ACCOUNT:', process.env.FIREBASE_SERVICE_ACCOUNT); // Verifica si está definida
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Parsear el JSON guardado como variable de entorno
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // En producción, debería estar configurada en las variables de entorno
  throw new Error('FIREBASE_SERVICE_ACCOUNT no está definido en las variables de entorno');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

console.log('Firebase Admin inicializado correctamente.'); // <-- Añade este log

module.exports = { admin, db };


