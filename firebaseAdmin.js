// backend/firebaseAdmin.js

const admin = require('firebase-admin');

let serviceAccount;
console.log('FIREBASE_SERVICE_ACCOUNT:', process.env.FIREBASE_SERVICE_ACCOUNT); // Verifica si está definida
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Parsear el JSON guardado como variable de entorno
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // En desarrollo, cargar localmente el archivo
  // serviceAccount = require('./serviceAccountKey.json');

  // En produccion, para que no de error, luego comentamos para hacer pruebas
  throw new Error('FIREBASE_SERVICE_ACCOUNT no está definido en las variables de entorno');
  
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db };

