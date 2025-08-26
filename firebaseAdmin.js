// backend/firebaseAdmin.js

const admin = require('firebase-admin');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Parsear el JSON guardado como variable de entorno
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // En desarrollo, cargar localmente el archivo
  // serviceAccount = require('./serviceAccountKey.json');

  // En produccion, para que no de error
  throw new Error('FIREBASE_SERVICE_ACCOUNT no está definido en las variables de entorno');
  
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db };

