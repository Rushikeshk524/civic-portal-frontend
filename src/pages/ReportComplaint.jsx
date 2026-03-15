import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import MapPicker from '../components/MapPicker';

export default function ReportComplaint() {
  const [form, setForm]             = useState({ title: '', description: '', category_id: '' });
  const [locationData, setLocationData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
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

      await api.post('/complaints', { ...form, location_id });
      navigate('/track');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className='container mt-4'>
        <h2 className='mb-4'>Report a Civic Issue</h2>
        {error && <div className='alert alert-danger'>{error}</div>}
        <div className='row'>

          {/* Form */}
          <div className='col-md-5'>
            <div className='card shadow-sm'>
              <div className='card-body'>
                <form onSubmit={handleSubmit}>
                  <div className='mb-3'>
                    <label className='form-label fw-bold'>Title *</label>
                    <input type='text' className='form-control'
                      placeholder='e.g. Large pothole near bus stop'
                      onChange={e => setForm({...form, title: e.target.value})} />
                  </div>

                  <div className='mb-3'>
                    <label className='form-label fw-bold'>Category *</label>
                    <select className='form-select'
                      onChange={e => setForm({...form, category_id: e.target.value})}>
                      <option value=''>-- Select Category --</option>
                      {categories.map(cat => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='mb-3'>
                    <label className='form-label fw-bold'>Description *</label>
                    <textarea className='form-control' rows={3}
                      placeholder='Describe the issue in detail...'
                      onChange={e => setForm({...form, description: e.target.value})} />
                  </div>

                  {locationData ? (
                    <div className='mb-3 p-2 bg-success bg-opacity-10 border border-success rounded small'>
                      ✅ Location pinned: {locationData.area_name}
                      {locationData.pincode ? ` — ${locationData.pincode}` : ''}
                    </div>
                  ) : (
                    <div className='mb-3 p-2 bg-warning bg-opacity-10 border border-warning rounded small'>
                      ⚠️ No location pinned yet — click on the map to add
                    </div>
                  )}

                  <button type='submit' className='btn btn-primary w-100' disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Complaint'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className='col-md-7'>
            <div className='card shadow-sm'>
              <div className='card-body'>
                <h6 className='card-title'>Pin Location on Map</h6>
                <MapPicker onLocationSelect={handleMapSelect} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}