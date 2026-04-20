const EventDetail = ({ event }) => {
  if (!event) {
    return (
      <div className="event-detail-empty">
        <div className="empty-icon">👈</div>
        <h2>Selecciona un evento</h2>
        <p>Haz click en cualquier evento de la lista para ver los detalles</p>
      </div>
    );
  }

  const title = event.title || event.name || 'Evento sin título';
  const description = event.description || event.snippet || '';
  const image = event.image_hd || event.thumbnail || event.image || null;
  const location = event.location || event.address || 'Ubicación no disponible';
  const url = event.link || event.url || event.event_url || '#';

  let date = 'Fecha no disponible';
  if (event.date) {
    if (typeof event.date === 'object' && event.date.start_date) {
      date = event.date.start_date;
    } else if (typeof event.date === 'string') {
      date = event.date;
    }
  }

  return (
    <div className="event-detail">
      {image && (
        <div className="event-detail-image">
          <img 
            src={image} 
            alt={title}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      <div className="event-detail-content">
        <h2>{title}</h2>

        <div className="event-detail-actions">
          <a href={url} target="_blank" rel="noreferrer" className="detail-btn get-tickets">
            🎫 Get tickets
          </a>
          <a href="#" className="detail-btn directions">
            📍 Directions
          </a>
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noreferrer"
            className="detail-btn share"
          >
            📤 Share
          </a>
        </div>

        <div className="event-detail-section">
          <h3>Details</h3>
          <div className="detail-item">
            <span className="detail-label">📅 Fecha</span>
            <span className="detail-value">{date}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📍 Ubicación</span>
            <span className="detail-value">{location}</span>
          </div>
        </div>

        <div className="event-detail-section">
          <h3>Descripción</h3>
          <p>{description || 'No hay descripción disponible'}</p>
        </div>

        {url && url !== '#' && (
          <div className="event-detail-section">
            <h3>Information and Tickets</h3>
            <a href={url} target="_blank" rel="noreferrer" className="info-link">
              Ver más información →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
