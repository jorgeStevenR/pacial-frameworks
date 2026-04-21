# Parcial Frameworks — Buscador de Eventos con Google Events API

Aplicación full-stack que consume la **Google Events API de SerpAPI** para buscar eventos en tiempo real por ciudad, rango de fechas y modalidad (virtual/presencial). Los resultados se muestran ordenados cronológicamente desde la fecha más próxima.

---

## Arquitectura

```
Frontend (React)  →  Backend (Express)  →  SerpAPI (Google Events)
localhost:3000        localhost:3001         serpapi.com
```

El frontend nunca habla directamente con SerpAPI. El backend actúa como proxy, protege la API key y normaliza la respuesta antes de enviarla al cliente.

---

## Estructura del proyecto

```
pacial-frameworks/
├── backend/
│   ├── server.js        # Servidor Express, proxy hacia SerpAPI
│   ├── .env             # API key (NO subir a producción)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js                    # Estado global, fetch, filtros
│   │   └── components/
│   │       ├── SearchPanel.js        # Barra de búsqueda y filtros
│   │       ├── EventList.js          # Lista de eventos (panel izquierdo)
│   │       └── EventDetail.js        # Detalle del evento (panel derecho)
│   └── package.json
└── bruno/
    └── parcial-serp-api-events/      # Colección Bruno para pruebas manuales
```

---

## Requisitos

- Node.js 18+
- Una API key válida de [SerpAPI](https://serpapi.com)

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd pacial-frameworks
```

### 2. Configurar la API key

Crear o editar el archivo `backend/.env`:

```
API_KEY=tu_api_key_de_serpapi
```

### 3. Instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend (en otra terminal)
cd frontend
npm install
```

### 4. Ejecutar

Abrir **dos terminales**:

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
# Servidor corriendo en http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# App disponible en http://localhost:3000
```

---

## Cómo funciona

### Backend (`backend/server.js`)

Expone un único endpoint:

```
GET /eventos
```

| Parámetro | Tipo    | Descripción                                           | Ejemplo         |
|-----------|---------|-------------------------------------------------------|-----------------|
| `ciudad`  | string  | Ciudad donde buscar eventos                           | `Bogota`        |
| `fecha`   | string  | Filtro temporal (`today`, `tomorrow`, `week`, `next_week`, `month`, `next_month`) | `week` |
| `virtual` | boolean | Solo eventos virtuales                                | `true`          |
| `hl`      | string  | Idioma de respuesta                                   | `es`            |
| `gl`      | string  | País de búsqueda                                      | `es`            |
| `start`   | number  | Paginación (múltiplos de 10)                          | `0`, `10`, `20` |

**Ejemplo:**
```
GET http://localhost:3001/eventos?ciudad=Bogota&fecha=week&virtual=false&hl=es&gl=co&start=0
```

El backend:
1. Construye el query (`events in Bogota this week`) y los `htichips` (filtros nativos de Google Events)
2. Llama a SerpAPI con `engine: google_events`
3. Normaliza las URLs de imágenes para obtener mayor resolución
4. **Ordena los resultados por fecha ascendente** (del evento más próximo al más lejano)
5. Retorna el array JSON al frontend

### Frontend (`frontend/src/`)

- **`App.js`**: Controla el estado global (ciudad, filtro de fecha, virtual, paginación) y ejecuta el `fetch` al backend.
- **`SearchPanel.js`**: Input de ciudad + botones de filtro por fecha + toggle virtual.
- **`EventList.js`**: Lista scrolleable con fecha, título, ubicación e imagen de cada evento. Al hacer clic en un evento lo selecciona para el detalle.
- **`EventDetail.js`**: Panel derecho con imagen, descripción completa, fecha, ubicación y botones de tickets/indicaciones/compartir.

---

## Pruebas con Bruno

[Bruno](https://www.usebruno.com/) es un cliente API de escritorio (alternativa a Postman) que guarda las colecciones como archivos `.yml` directamente en el repositorio.

### Cómo abrir la colección

1. Descargar e instalar [Bruno](https://www.usebruno.com/downloads)
2. Abrir Bruno → **Open Collection**
3. Seleccionar la carpeta `bruno/parcial-serp-api-events/`
4. Verás las siguientes peticiones disponibles:

| Petición                          | Descripción                                      |
|-----------------------------------|--------------------------------------------------|
| `Get eventos con filtros variables` | Búsqueda completa con ciudad, fecha, virtual y paginación |
| `Get todos los eventos (sin filtros)` | Búsqueda simple solo por ciudad             |

### Variables disponibles

Antes de ejecutar una petición, puedes modificar las variables en el panel derecho de Bruno:

| Variable | Valor por defecto | Opciones                                              |
|----------|-------------------|-------------------------------------------------------|
| `url`    | `http://localhost:3001` | —                                               |
| `ciudad` | `Austin`          | Cualquier ciudad                                      |
| `fecha`  | `week`            | `today`, `tomorrow`, `week`, `next_week`, `month`, `next_month` |
| `virtual`| `false`           | `true` / `false`                                      |
| `hl`     | `es`              | Código de idioma                                      |
| `gl`     | `es`              | Código de país                                        |
| `start`  | `0`               | `0`, `10`, `20`... para paginación                    |

> El backend debe estar corriendo en `localhost:3001` antes de ejecutar las peticiones en Bruno.

---

## Tecnologías utilizadas

| Capa     | Tecnología                        |
|----------|-----------------------------------|
| Frontend | React 19, Fetch API, Lucide React |
| Backend  | Node.js, Express 5, SerpAPI SDK   |
| API      | Google Events API vía SerpAPI     |
| Pruebas  | Bruno (colección incluida)        |
