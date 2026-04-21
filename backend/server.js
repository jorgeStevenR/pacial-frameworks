require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getJson } = require("serpapi");

const app = express();
app.use(cors());

app.get("/eventos", (req, res) => {
  const ciudad = req.query.ciudad || "Austin";
  const fecha = req.query.fecha || null;
  const esVirtual = req.query.virtual === 'true' || false;
  const idioma = req.query.hl || "es";
  const pais = req.query.gl || "es";
  const start = req.query.start || 0;

  // Construir query con filtros
  let query = `events in ${ciudad}`;
  
  if (fecha) {
    const mapeoFecha = {
      'today': 'today',
      'tomorrow': 'tomorrow',
      'week': 'this week',
      'next_week': 'next week',
      'month': 'this month',
      'next_month': 'next month'
    };
    const fechaText = mapeoFecha[fecha];
    if (fechaText) {
      query += ` ${fechaText}`;
    }
  }

  if (esVirtual) {
    query += ' virtual';
  }

  // Construir chips de filtros (alternativo, en caso de que se necesite)
  let htichips = "";
  if (fecha) {
    const mapeoChips = {
      'today': 'date:today',
      'tomorrow': 'date:tomorrow',
      'week': 'date:week',
      'next_week': 'date:next_week',
      'month': 'date:month',
      'next_month': 'date:next_month'
    };
    htichips = mapeoChips[fecha] || "";
  }

  if (esVirtual) {
    if (htichips) {
      htichips += ",event_type:Virtual-Event";
    } else {
      htichips = "event_type:Virtual-Event";
    }
  }

  const params = {
    engine: "google_events",
    q: query,
    location: ciudad,
    gl: pais,
    hl: idioma,
    api_key: process.env.API_KEY,
    start: parseInt(start),
    no_cache: true
  };

  // Agregar htichips si hay filtros
  if (htichips) {
    params.htichips = htichips;
  }

  console.log("Query:", query);
  console.log("Parámetros de búsqueda:", params);

  const normalizeImageUrl = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string') return null;

    let image = imageUrl.trim();

    // Priorizar imágenes de googleusercontent con mayor tamaño
    if (image.includes('lh3.googleusercontent.com')) {
      image = image.replace(/=s\d+/g, '');
      image = image.includes('?') ? `${image}&s=1200` : `${image}=s1200`;
      return image;
    }

    // Ajustar thumbnails de Google que usan encrypted-tbn*.gstatic.com
    if (image.includes('encrypted-tbn') && image.includes('gstatic.com')) {
      if (image.match(/[?&]s(=\d*)?/)) {
        image = image.replace(/([?&]s)(=\d*)?/g, '$1=1200');
      } else if (image.includes('?')) {
        image += '&s=1200';
      } else {
        image += '?s=1200';
      }
      return image;
    }

    // Si viene con parámetro de tamaño, intentar pedir mayor resolución
    if (image.match(/([?&]s)(=\d+)?/)) {
      image = image.replace(/([?&]s)(=\d+)?/g, '$1=1200');
      return image;
    }

    return image;
  };

  const sortByDate = (events) => {
    const months = { ene:0, feb:1, mar:2, abr:3, may:4, jun:5, jul:6, ago:7, sep:8, oct:9, nov:10, dic:11 };
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getTimestamp = (event) => {
      const d = event.date;
      const str = (typeof d === 'object' ? d?.start_date : d) || '';
      const parts = str.toLowerCase().trim().split(' ');
      const month = months[parts[0]];
      const day = parseInt(parts[1]);
      if (month === undefined || isNaN(day)) return Infinity;
      const year = today.getFullYear();
      const date = new Date(year, month, day);
      if (date < today) date.setFullYear(year + 1);
      return date.getTime();
    };

    return events.sort((a, b) => getTimestamp(a) - getTimestamp(b));
  };

  getJson(params, (json) => {
    const results = json.events_results || [];

    // Procesar resultados para incluir imágenes de alta resolución
    const processedResults = results.map(event => {
      let image = null;

      if (event.image_url) {
        image = normalizeImageUrl(event.image_url);
      } else if (event.image) {
        image = normalizeImageUrl(event.image);
      } else if (event.thumbnail) {
        image = normalizeImageUrl(event.thumbnail);
      } else if (event.images && Array.isArray(event.images) && event.images.length > 0) {
        image = normalizeImageUrl(event.images[event.images.length - 1]);
      }

      return {
        ...event,
        thumbnail: image,
        image: image,
        image_hd: image,
        date: event.date || event.event_date || null,
        title: event.title || event.event_title || '',
        location: event.location || event.address || event.place || 'Ubicación no disponible'
      };
    });

    const sorted = sortByDate(processedResults);
    console.log(`Resultados: ${sorted.length} eventos encontrados`);
    res.json(sorted);
  });
});

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});