import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

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
    // Build address from most specific to least specific
    const parts = [
      a.road || a.pedestrian || a.footway,
      a.village || a.suburb || a.neighbourhood || a.hamlet,
      a.town || a.city || a.county,
      a.state_district,
      a.state,
      a.postcode
    ].filter(Boolean); // Remove undefined/null parts

    const address = parts.join(', ');
    onSelect(lat, lng, address || data.display_name);
  })
  .catch(() => {
    onSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  });
    }
  });

  if (!pos) return null;
  return <Marker position={pos} />;
}

export default function MapPicker({ onLocationSelect }) {
  const [selectedAddress, setSelectedAddress] = useState('');

  const handleSelect = (lat, lng, address) => {
    setSelectedAddress(address);
    onLocationSelect(lat, lng, address);
  };

  return (
    <div>
      <p className='text-muted small mb-2'>
        Click on the map to pin the exact issue location
      </p>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{
          height: '350px',
          width: '100%',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          cursor: 'crosshair'
        }}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='© OpenStreetMap contributors'
        />
        <ClickHandler onSelect={handleSelect} />
      </MapContainer>
      {selectedAddress && (
        <div className='mt-2 p-2 bg-light rounded small'>
          <strong>Selected:</strong> {selectedAddress}
        </div>
      )}
    </div>
  );
}