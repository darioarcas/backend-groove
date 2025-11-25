// backend/app.js
const express = require('express');
const app = express();
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes.js');
console.log('FIREBASE_SERVICE_ACCOUNT 2:', process.env.FIREBASE_SERVICE_ACCOUNT); // Verifica si está definida
const webhookRoutes = require('./routes/webhookRoutes.js');



//require('dotenv').config(); // Solo en local, no en produccion

app.use(cors());
app.use(express.json());
app.use('/api/webhook', webhookRoutes);

// Ruta base
app.use('/api', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`);
});

