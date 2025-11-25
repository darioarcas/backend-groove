// backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin'); // Esto usa la inicialización hecha en firebaseAdmin.js
console.log('FIREBASE_SERVICE_ACCOUNT 1 y 1/2:', process.env.FIREBASE_SERVICE_ACCOUNT); // Verifica si está definida
const { crearPreferenciaPago } = require('../services/mercadoPagoService.js');
const db = admin.firestore();  // Accedemos a Firestore, ya debería estar inicializado correctamente


// Ruta para crear la preferencia de pago
router.post('/create_preference', async (req, res) => {
  console.log("📥 Llamada recibida en /create_preference"); // 👈
  
  try {
    // Obtenemos la información de la solicitud
    const { cursoNombre, cursoId, uid, base_url } = req.body;

    // 1. Obtener el precio del curso desde Firestore
    const cursoRef = db.collection('cursos_privados').doc(cursoId);  // Suponiendo que los cursos privados están en esta colección
    const cursoDoc = await cursoRef.get();

    if (!cursoDoc.exists) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    const cursoData = cursoDoc.data();
    const precio = cursoData.precio;  // Suponiendo que el campo "precio" está en el curso

    // 2. Crear la preferencia de pago con MercadoPago, usando el precio obtenido de Firestore
    const init_point = await crearPreferenciaPago({ 
      cursoNombre, 
      cursoId, 
      uid, 
      precio,  // Le pasamos el precio obtenido de Firestore
      base_url 
    });

    console.log("🔁 init_point generado:", init_point); // 👈

    // 3. Respondemos con la URL para redirigir al usuario a MercadoPago
    res.json({ init_point });
  } catch (error) {
    console.error("❌ Error en /create_preference:", error); // 👈
    res.status(500).json({ error: 'Error creando preferencia' });
  }
});

module.exports = router;
