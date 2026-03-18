import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import MapPicker from '../components/MapPicker';
import ImageUpload from '../components/ImageUpload';
import './ReportComplaint.css';

export default function ReportComplaint() {
  const [form, setForm]               = useState({ title: '', description: '', category_id: '' });
  const [locationData, setLocationData] = useState(null);
  const [imageUrl, setImageUrl]         = useState('');
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories]     = useState([]);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data));
  }, []);

  const handleMapSelect = (lat, lng, area_name, pincode) => {
    setLocationData({ latitude: lat, longitude: lng, area_name, pincode });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let location_id = null;
      if (locationData) {
        const locRes = await api.post('/locations', locationData);
        location_id = locRes.data.location_id;
      }
      await api.post('/complaints', {
        ...form,
        location_id,
        image_url: imageUrl || null
      });
      navigate('/track');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className='pw-page'>
        <div className='pw-container'>
          <div className='section-label'>New Complaint</div>
          <h2 style={{ marginBottom: '28px', fontSize: 'clamp(1.4rem,3vw,2rem)', letterSpacing:'-0.03em' }}>
            Report a Civic Issue
          </h2>

          {error && <div className='alert alert-error'>{error}</div>}

          <div className='report-layout'>
            {/* Form */}
            <div className='report-panel'>
              <form onSubmit={handleSubmit}>
                <div className='field'>
                  <label className='label'>Title *</label>
                  <input type='text' className='input'
                    placeholder='e.g. Large pothole near bus stop'
                    onChange={e => setForm({...form, title: e.target.value})} />
                </div>

                <div className='field'>
                  <label className='label'>Category *</label>
                  <select className='select'
                    onChange={e => setForm({...form, category_id: e.target.value})}>
                    <option value=''>-- Select Category --</option>
                    {categories.map(cat => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='field'>
                  <label className='label'>Description *</label>
                  <textarea className='input' rows={3}
                    placeholder='Describe the issue in detail...'
                    onChange={e => setForm({...form, description: e.target.value})} />
                </div>

                <div className='field'>
                  <ImageUpload
                    onUpload={url => setImageUrl(url)}
                    onUploadStart={() => setUploading(true)}
                    onUploadEnd={() => setUploading(false)} />
                </div>

                {locationData ? (
                  <div className='loc-pin-ok'>
                    Location pinned: {locationData.area_name}
                    {locationData.pincode ? ` — ${locationData.pincode}` : ''}
                  </div>
                ) : (
                  <div className='loc-pin-warn'>
                    No location pinned yet — click on the map to add
                  </div>
                )}

                <button type='submit' className='report-submit' disabled={loading || uploading}>
                  {loading ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </form>
            </div>

            {/* Map */}
            <div className='report-map-panel'>
              <h6>Pin Location on Map</h6>
              <MapPicker onLocationSelect={handleMapSelect} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}