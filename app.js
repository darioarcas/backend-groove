// backend/app.js

require('./firebaseAdmin');  // Inicializa Firebase antes de cualquier otra cosa
const express = require('express');
const app = express();
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes.js');
const webhookRoutes = require('./routes/webhookRoutes.js');
const http = require('http'); // Importamos http
const socketIo = require('socket.io'); // Importamos socket.io

// require('dotenv').config(); // Solo en local, no en producción

// Creamos un servidor HTTP para WebSocket
const server = http.createServer(app);
const io = socketIo(server);  // Inicializamos socket.io con el servidor HTTP

// Middleware para habilitar CORS y analizar JSON
app.use(cors());
app.use(express.json());


// ⭐ Pasar io al middleware de webhook
app.use('/api/webhook', (req, res, next) => {
  req.io = io;  // Inyectamos io en el request
  next();
}, webhookRoutes);

// Ruta base
app.use('/api', paymentRoutes);

// Configuramos WebSocket para escuchar conexiones
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  socket.on('ping', () => {
    console.log('Petición "ping" recibida desde:', socket.id);
    io.emit('notify', { message: '¡Tienes nueva notificación!', timestamp: new Date().toISOString() });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

app.post('/ping', (req, res) => {
  console.log('Ping recibido, manteniendo servidor activo');
  io.emit('notify', { message: '¡Notificación desde HTTP ping!', timestamp: new Date().toISOString() });
  res.sendStatus(200);
});

// Ruta POST para mantener el servidor despierto
// app.post('/ping', (req, res) => {
//   console.log('Ping recibido, manteniendo servidor activo');
//   res.sendStatus(200);  // Respondemos con OK (200)
// });

// Iniciamos el servidor HTTP en el puerto configurado
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`);
});
