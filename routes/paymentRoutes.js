// backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { crearPreferenciaPago, crearSuscripcion } = require('../services/mercadoPagoService.js');
const db = admin.firestore();

// Ruta para crear una preferencia de pago
router.post('/create_preference', async (req, res) => {
  console.log("📥 Llamada recibida en /create_preference");


  
  try {
    const { cursoNombre, cursoId, uid, base_url } = req.body;

    // 1. Obtener el precio del curso desde Firestore
    const cursoRef = db.collection('cursos_privados').doc(cursoId);
    const cursoDoc = await cursoRef.get();
    console.log("🔍 Curso obtenido de Firestore:", cursoDoc);

    if (!cursoDoc.exists) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    const cursoData = cursoDoc.data();
    const precio = cursoData.precio;

    // 2. Crear la preferencia de pago con MercadoPago
    const init_point = await crearPreferenciaPago({ 
      cursoNombre, 
      cursoId, 
      uid, 
      precio,
      base_url 
    });

    console.log("🔁 init_point generado:", init_point);

    // 3. Emitir notificación a todos los clientes conectados
    if (req.io) {
      const payload = {
        type: 'preference_created',
        cursoNombre,
        cursoId,
        init_point,
        createdAt: new Date().toISOString()
      };
      req.io.emit('notify', JSON.stringify(payload));
      console.log('[notify] preference_created emitted:', payload);
    } else {
      console.warn('[notify] req.io not available — no emit on preference creation');
    }

    // 4. Responder al cliente (una sola vez)
    return res.status(201).json({ init_point, cursoNombre });
  } catch (error) {
    console.error("❌ Error en /create_preference:", error);
    return res.status(500).json({ error: 'Error creando preferencia' });
  }
});







// Ruta para crear una suscripción
router.post('/create_subscription', async (req, res) => {
  console.log("📥 Llamada recibida en /create_subscription");

  try {
    const { uid, base_url } = req.body;

    // Crear la suscripción en MercadoPago
    const init_point = await crearSuscripcion({
      uid,
      base_url
    });

    console.log("🔁 init_point generado:", init_point);

    // Activamos la suscripción en la base de datos
    const userRef = db.collection("users").doc(uid);
    await userRef.update({
      suscripcionActiva: true,  // Activamos el campo de suscripción
      suscripcionFechaInicio: admin.firestore.FieldValue.serverTimestamp(),
      // suscripcionFechaVencimiento: admin.firestore.FieldValue.serverTimestamp().toMillis() + 5 * 60 * 1000,  // 5 minutos de prueba
      suscripcionFechaVencimiento: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Emitir notificación a todos los clientes conectados (opcional)
    if (req.io) {
      const payload = {
        type: 'subscription_created',
        uid,
        init_point,
        createdAt: new Date().toISOString()
      };
      req.io.emit('notify', JSON.stringify(payload));
      console.log('[notify] subscription_created emitted:', payload);
    } else {
      console.warn('[notify] req.io not available — no emit on subscription creation');
    }

    return res.status(201).json({ init_point });
  } catch (error) {
    console.error("❌ Error en /create_subscription:", error);
    return res.status(500).json({ error: 'Error creando suscripción' });
  }
});





module.exports = router;