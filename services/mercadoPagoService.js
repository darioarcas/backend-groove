// backend/services/mercadoPagoService.js
const fetch = require('node-fetch');

const crearPreferenciaPago = async ({ cursoNombre, cursoId, uid }) => {
  const preference = {
    items: [
      {
        title: cursoNombre || 'Curso',
        quantity: 1,
        unit_price: 10,
        currency_id: 'ARS',
      },
    ],
    back_urls: {
      // success: `http://localhost:3000/pago-exitoso`, // ajustá según frontend real
      success: `https://www.google.com`, // solo para pruebas

      // failure: `http://localhost:3000/pago-fallido`,
      failure: `https://www.google.com`,
    },
    notification_url: `https://backend-groove-pi69.onrender.com/api/webhook/mercadopago`,

    // URL de Ngrok
    // notification_url: `https://fb5dd66e04b4.ngrok-free.app`,
    external_reference: `${cursoId}_${uid}`,
    auto_return: 'approved',
  };

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preference),
    });
    const data = await response.json();
    console.log("✅ Preferencia creada:", data);
    return data.init_point;
    // return { init_point: data.init_point };
    // return data.init_point;
  } catch (error) {
    console.error('❌ Error creando preferencia vía REST:', error);
    throw error;
  }
};

module.exports = { crearPreferenciaPago };



