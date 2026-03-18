import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import './MapPicker.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
});

function ClickHandler({ onSelect }) {
  const [pos, setPos] = useState(null);

  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setPos([lat, lng]);

      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        .then(r => r.json())
        .then(data => {
          const a = data.address;
          const parts = [
            a.road || a.pedestrian || a.footway,
            a.village || a.suburb || a.neighbourhood || a.hamlet,
            a.town || a.city || a.county,
            a.state_district,
            a.state,
          ].filter(Boolean);

          const area_name = parts.join(', ');
          const pincode   = a.postcode || '';

          onSelect(lat, lng, area_name, pincode);
        })
        .catch(() => {
          onSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`, '');
        });
    }
  });

  if (!pos) return null;
  return <Marker position={pos} />;
}

export default function MapPicker({ onLocationSelect }) {
  const [selectedAddress, setSelectedAddress] = useState('');

  const handleSelect = (lat, lng, area_name, pincode) => {
    setSelectedAddress(`${area_name}${pincode ? ' — ' + pincode : ''}`);
    onLocationSelect(lat, lng, area_name, pincode);
  };

  return (
    <div className='map-picker'>
      <p className='map-hint'>
        Click on the map to pin the exact issue location
      </p>
      <MapContainer
        center={[19.4609, 72.8160]}
        zoom={12}
        style={{ height: '350px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='OpenStreetMap contributors'
        />
        <ClickHandler onSelect={handleSelect} />
      </MapContainer>
    </div>
  );
}