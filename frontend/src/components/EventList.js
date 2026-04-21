const EventList = ({ events, selectedEvent, onSelectEvent, loading, error, ciudad }) => {
  if (loading && events.length === 0) {
    return <div className="events-list-empty">Cargando eventos...</div>;
  }

  if (error) {
    const mensaje = error.toLowerCase().includes('failed to fetch')
      ? 'No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo en localhost:3001.'
      : `Ocurrió un error: ${error}`;
    return <div className="events-list-error">{mensaje}</div>;
  }

  if (events.length === 0) {
    return (
      <div className="events-list-empty">
        <div className="empty-icon">🔍</div>
        <h2>Sin resultados</h2>
        <p>No se encontraron eventos{ciudad ? ` en "${ciudad}"` : ''}. Intenta con otra ciudad o cambia el filtro de fecha.</p>
      </div>
    );
  }

  return (
    <div className="events-list-container">
      <div className="events-list-header">
        <h3>{events.length} resultados</h3>
      </div>
      <div className="events-list">
        {events.map((event, index) => {
          const title = event.title || event.name || 'Evento sin título';
          const image = event.image_hd || event.thumbnail || event.image || null;
          const isSelected = selectedEvent && selectedEvent.title === title;

          // Extraer fecha
          let date = 'Fecha no disponible';
          if (event.date) {
            if (typeof event.date === 'object' && event.date.start_date) {
              date = event.date.start_date;
            } else if (typeof event.date === 'string') {
              date = event.date;
            }
          }

          // Extraer día y mes
          let day = '', month = '';
          try {
            const dateParts = date.split(' ');
            if (dateParts.length >= 1) {
              day = dateParts[0];
              month = dateParts[1] || '';
            }
          } catch (e) {
            day = '';
            month = '';
          }

          const location = event.location || event.address || 'Ubicación no disponible';

          return (
            <div
              key={`${title}-${index}`}
              className={`event-list-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectEvent(event)}
            >
              <div className="event-list-date">
                <span className="day">{day}</span>
                <span className="month">{month}</span>
              </div>

              <div className="event-list-content">
                <h4>{title}</h4>
                <p className="location">📍 {location}</p>
                <p className="date">📅 {date}</p>
              </div>

              {image && <div className="event-list-image">
                <img 
                  src={image} 
                  srcSet={
                    image && image.includes('googleusercontent') 
                      ? `${image}=s80 1x, ${image}=s160 2x`
                      : undefined
                  }
                  alt={title}
                  loading="lazy"
                  decoding="async"
                />
              </div>}
            </div>
          );
        })}
      </div>

      {!loading && events.length > 0 && (
        <button className="load-more-list">Cargar más eventos</button>
      )}
    </div>
  );
};

export default EventList;
