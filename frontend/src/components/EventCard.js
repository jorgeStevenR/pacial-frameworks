const EventCard = ({ event, index }) => {
  const title = event.title || event.name || event.event_title || 'Evento sin título';
  const description = event.description || event.snippet || event.event_description || '';
  const location = event.location || event.event_location || event.place || event.address || 'Ubicación no disponible';
  const image = event.thumbnail || event.image || event.image_url || null;
  
  // Manejar fecha que puede ser objeto o string
  let date = 'Fecha no disponible';
  if (event.date) {
    if (typeof event.date === 'object' && event.date.start_date) {
      date = event.date.start_date;
    } else if (typeof event.date === 'string') {
      date = event.date;
    }
  } else if (event.event_date) {
    date = typeof event.event_date === 'object' && event.event_date.start_date 
      ? event.event_date.start_date 
      : event.event_date;
  } else if (event.datetime) {
    date = event.datetime;
  } else if (event.event_time) {
    date = event.event_time;
  }
  
  const url = event.link || event.url || event.event_url || '#';

  return (
    <a key={`${title}-${index}`} href={url} target="_blank" rel="noreferrer" className="event-card">
      {image && (
        <div className="event-card-image">
          <img src={image} alt={title} />
        </div>
      )}
      <div className="event-card-header">
        <span className="event-badge">Evento</span>
        <span>{date}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="event-card-footer">
        <span>{location}</span>
        <span>Ver más</span>
      </div>
    </a>
  );
};

export default EventCard;
