import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';

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

  // Only show complaints that have a location with lat/lng
  const withLocation = complaints.filter(
    c => c.location?.latitude && c.location?.longitude
  );

  const filtered = filter === 'all'
    ? withLocation
    : withLocation.filter(c => c.status === filter);

  return (
    <>
      <Navbar />
      <div className='container-fluid mt-4'>
        <div className='d-flex justify-content-between align-items-center mb-3 px-3'>
          <div>
            <h2 className='mb-0'>Complaints Map</h2>
            <small className='text-muted'>
              Showing {filtered.length} of {complaints.length} complaints with location
            </small>
          </div>

          {/* Filter Buttons */}
          <div className='btn-group'>
            {['all', 'pending', 'in_progress', 'resolved'].map(f => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className='d-flex gap-3 mb-3 px-3'>
          <span><img src='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png' height='20' /> Pending</span>
          <span><img src='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png' height='20' /> In Progress</span>
          <span><img src='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png' height='20' /> Resolved</span>
        </div>

        {loading && (
          <div className='text-center mt-5'>
            <div className='spinner-border text-primary' />
            <p className='mt-2 text-muted'>Loading map...</p>
          </div>
        )}

        {!loading && withLocation.length === 0 && (
          <div className='alert alert-info mx-3'>
            No complaints with location found. Submit complaints with map pin to see them here.
          </div>
        )}

        {!loading && withLocation.length > 0 && (
          <div className='container-xl py-2 border border-dark border-2'>
            <MapContainer
              center={[19.4609, 72.8160]}
              zoom={12}
              style={{ height: '200px', width: '100%' }}
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
                    <div style={{ minWidth: '200px' }}>
                      <strong>{c.title}</strong>
                      <div className='my-1'>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className='mb-1 small'>
                         Issue: {c.category?.category_name}
                      </p>
                      <p className='mb-1 small'>
                         Author: {c.user?.full_name}
                      </p>
                      <p className='mb-1 small'>
                         Department: {c.department?.department_name || 'Not assigned'}
                      </p>
                      <p className='mb-0 small'>
                         {c.location?.area_name}
                        {c.location?.pincode ? ` — ${c.location.pincode}` : ''}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </>
  );
}