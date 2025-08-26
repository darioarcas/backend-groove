// backend/routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const { crearPreferenciaPago } = require('../services/mercadoPagoService');

router.post('/create_preference', async (req, res) => {
  console.log("📥 Llamada recibida en /create_preference"); // 👈
  try {
    const { cursoNombre, cursoId, uid } = req.body;
    const init_point = await crearPreferenciaPago({ cursoNombre, cursoId, uid });
    console.log("🔁 init_point generado:", init_point); // 👈
    res.json({ init_point });
  } catch (error) {
    console.error("❌ Error en /create_preference:", error); // 👈
    res.status(500).json({ error: 'Error creando preferencia' });
  }
});

module.exports = router;

