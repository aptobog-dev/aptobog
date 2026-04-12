import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend scraper de AptoBog activo 🚀');
});

app.post('/scrap', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      ok: false,
      error: 'Falta la URL',
    });
  }

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(data);

    const titulo = $('title').text().trim();

    const textoPlano = $('body')
      .text()
      .replace(/\s+/g, ' ')
      .trim();

    const precioMatch = textoPlano.match(/\$\s?\d{1,3}(?:\.\d{3})+(?:,\d+)?/);
    const precioTexto = precioMatch ? precioMatch[0].trim() : '';

    const habitacionesMatch = textoPlano.match(/(\d+)\s*Habs?/i);
    const habitaciones = habitacionesMatch ? habitacionesMatch[1].trim() : '';

    const areaMatch = textoPlano.match(/(\d+(?:[.,]\d+)?\s?m²)/i);
    const area = areaMatch ? areaMatch[1].trim() : '';

    let ubicacion = '';

    ubicacion = $('h2:contains("Ubicación")')
      .next()
      .text()
      .trim();

    if (!ubicacion) {
      const ubicacionMatch = textoPlano.match(
        /Ubicación\s+([A-Za-zÁÉÍÓÚáéíóúñÑ0-9,\-.\s]+)/i
      );

      if (ubicacionMatch) {
        ubicacion = ubicacionMatch[1]
          .split(/Ver en mapa|Contactar|Precio|Área|Habitaciones|Baños|Estrato/i)[0]
          .trim();
      }
    }

    return res.json({
      ok: true,
      titulo,
      precioTexto,
      habitaciones,
      area,
      ubicacion,
    });
  } catch (error) {
    console.error('Error al scrapear:', error.message);

    return res.status(500).json({
      ok: false,
      error: 'Error al scrapear la página',
      detalle: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});