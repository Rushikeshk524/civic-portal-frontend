import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import './AdminMap.css';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
});

// Custom colored markers for each status
const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const icons = {
  pending:     createIcon('grey'),
  in_progress: createIcon('orange'),
  resolved:    createIcon('green'),
};

export default function AdminMap() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all');

  useEffect(() => {
    api.get('/admin/complaints')
      .then(r => { setComplaints(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const withLocation = complaints.filter(
    c => c.location?.latitude && c.location?.longitude
  );

  const filtered = filter === 'all'
    ? withLocation
    : withLocation.filter(c => c.status === filter);

  return (
    <>
      <Navbar />
      <div className='pw-page'>
        <div className='pw-container'>
          <div className='amap-hd'>
            <div>
              <div className='section-label'>Admin Panel</div>
              <h2>Complaints Map</h2>
              <small>Showing {filtered.length} of {complaints.length} complaints with location</small>
            </div>

            {/* Filter Tabs */}
            <div className='tabs'>
              {['all', 'pending', 'in_progress', 'resolved'].map(f => (
                <button
                  key={f}
                  className={`tab${filter === f ? ' active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className='amap-legend'>
            <span className='amap-leg-item'>
              <img src='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png' height='20' alt='pending' /> Pending
            </span>
            <span className='amap-leg-item'>
              <img src='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png' height='20' alt='in-progress' /> In Progress
            </span>
            <span className='amap-leg-item'>
              <img src='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png' height='20' alt='resolved' /> Resolved
            </span>
          </div>

          {loading && (
            <div className='loading-center'><div className='spinner' /><span>Loading map...</span></div>
          )}

          {!loading && withLocation.length === 0 && (
            <div className='alert alert-info'>
              No complaints with location found. Submit complaints with map pin to see them here.
            </div>
          )}

          {!loading && withLocation.length > 0 && (
            <div className='amap-frame'>
              <MapContainer
                center={[19.4609, 72.8160]}
                zoom={12}
                style={{ height: '600px', width: '100%' }}
              >
                <TileLayer
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  attribution='OpenStreetMap contributors'
                />
                {filtered.map(c => (
                  <Marker
                    key={c.complaint_id}
                    position={[
                      parseFloat(c.location.latitude),
                      parseFloat(c.location.longitude)
                    ]}
                    icon={icons[c.status] || icons.pending}
                  >
                    <Popup>
                      <div className='amap-popup'>
                        <strong>{c.title}</strong>
                        <StatusBadge status={c.status} />
                        <p>Issue: {c.category?.category_name}</p>
                        <p>Author: {c.user?.full_name}</p>
                        <p>Department: {c.department?.department_name || 'Not assigned'}</p>
                        <p>{c.location?.area_name}{c.location?.pincode ? ` — ${c.location.pincode}` : ''}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </div>
      </div>
    </>
  );
}