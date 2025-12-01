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
app.use('/api/webhook', webhookRoutes);

// Ruta base
app.use('/api', paymentRoutes);

// Configuramos WebSocket para escuchar conexiones
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Escuchar evento de "ping" y enviar una notificación
  socket.on('ping', () => {
    console.log('Petición "ping" recibida');
    socket.emit('notify', '¡Tienes nueva notificación!');  // Enviamos una notificación al cliente
  });

  // Cuando el cliente se desconecta
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Ruta POST para mantener el servidor despierto
app.post('/ping', (req, res) => {
  console.log('Ping recibido, manteniendo servidor activo');
  res.sendStatus(200);  // Respondemos con OK (200)
});

// Iniciamos el servidor HTTP en el puerto configurado
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`);
});
