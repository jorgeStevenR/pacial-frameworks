import { Search, CalendarDays, MapPin, Globe } from 'lucide-react';

const SearchPanel = ({ 
  ciudad, 
  setCiudad, 
  fechaSeleccionada, 
  soloVirtual, 
  filtrosDisponibles,
  onSubmit,
  onFiltroFecha,
  onFiltroVirtual
}) => {
  return (
    <div className="search-panel">
      <div className="search-title">
        <div className="brand-icon">📅</div>
        <div>
          <p>Google Events Explorer</p>
          <h1>Busca eventos en tiempo real</h1>
        </div>
      </div>

      <form className="search-form" onSubmit={onSubmit}>
        <div className="query-block">
          <label>Buscar</label>
          <div className="input-with-icon">
            <Search size={18} />
            <input
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              placeholder="Events in Austin"
              aria-label="Buscar ciudad"
            />
          </div>
        </div>

        <div className="details-row">
          <div className="detail-card">
            <MapPin size={16} />
            <span>{ciudad}</span>
          </div>
          <div className="detail-card">
            <Globe size={16} />
            <span>es</span>
          </div>
          <div className="detail-card">
            <CalendarDays size={16} />
            <span>es</span>
          </div>
        </div>

        <div className="chips-row">
          {Object.entries(filtrosDisponibles).map(([key, { label }]) => (
            <button 
              key={key} 
              type="button" 
              className={`chip ${fechaSeleccionada === key ? 'chip-active' : ''}`}
              onClick={() => onFiltroFecha(key)}
            >
              {label}
            </button>
          ))}
          <button 
            type="button" 
            className={`chip ${soloVirtual ? 'chip-active' : ''}`}
            onClick={onFiltroVirtual}
          >
            Virtual
          </button>
        </div>

        <div className="actions-row">
          <button type="submit" className="btn-primary">Ejecutar</button>
        </div>
      </form>
    </div>
  );
};

export default SearchPanel;
