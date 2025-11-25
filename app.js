// backend/app.js
const express = require('express');
const app = express();
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes.js');
const webhookRoutes = require('./routes/webhookRoutes.js');




require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/api/webhook', webhookRoutes);

// Ruta base
app.use('/api', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`);
});

