//routes/webhookRoutes.js

const express = require("express");
const router = express.Router();
const { admin, db } = require("../firebaseAdmin");
const fetch = require("node-fetch");

router.post("/mercadopago", async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === "payment") {
      const paymentId = data.id;

      // Obtener el pago desde Mercado Pago
      const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
      });

      const payment = await paymentRes.json();

      if (payment.status === "approved") {
        const [cursoId, uid] = payment.external_reference.split("_");

        // 🔓 Actualizar usuario en Firestore
        const userRef = db.collection("users").doc(uid);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
          console.warn("⚠️ Usuario no encontrado:", uid);
          return res.sendStatus(404);
        }

        const userData = userSnap.data();
        const cursosComprados = new Set(userData.cursosComprados || []);
        cursosComprados.add(cursoId);

        await userRef.update({
          cursosComprados: Array.from(cursosComprados),
        });

        // Agregar UID como comprador del curso
        const cursoRef = db.collection("cursos_privados").doc(cursoId);
        await cursoRef.update({
          compradores: admin.firestore.FieldValue.arrayUnion(uid),
        });

        console.log(`✅ Usuario ${uid} habilitado para el curso ${cursoId}`);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error en webhook de Mercado Pago:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
