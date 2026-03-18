import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import './TrackComplaint.css';

export default function TrackComplaint() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    api.get('/complaints')
      .then(r => { setComplaints(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statusColor = (status) => {
    if (status === 'resolved')    return 'var(--green)';
    if (status === 'in_progress') return 'var(--amber)';
    return 'var(--gray-4)';
  };

  return (
    <>
      <Navbar />
      <div className='pw-page'>
        <div className='pw-container'>
          <div className='track-hd'>
            <div>
              <div className='section-label'>My Complaints</div>
              <h2>My Complaints</h2>
            </div>
            <a href='/report' className='btn btn-lime btn-sm'>+ Report New Issue</a>
          </div>

          {loading && (
            <div className='loading-center'>
              <div className='spinner' />
              <span>Loading...</span>
            </div>
          )}

          {!loading && complaints.length === 0 && (
            <div className='track-empty'>
              <h4>No complaints submitted yet.</h4>
              <p>Start by reporting a civic issue in your area.</p>
            </div>
          )}

          <div className='track-grid'>
            {complaints.map(c => (
              <div
                key={c.complaint_id}
                className='track-card'
                style={{ '--tc-color': statusColor(c.status) }}
              >
                <div className='track-card-top'>
                  <span className='track-card-id'>#{c.complaint_id}</span>
                  <StatusBadge status={c.status} />
                </div>

                <div className='track-card-title'>{c.title}</div>
                <div className='track-card-desc'>
                  {c.description?.substring(0, 80)}...
                </div>

                <div className='track-chips'>
                  {c.category && <span className='chip'> {c.category.category_name}</span>}
                  {c.department && <span className='chip'> {c.department.department_name}</span>}
                  {!c.department && <span className='chip'>🏢 Not assigned yet</span>}
                </div>

                {c.location && (
                  <div className='track-card-location'>
                     {c.location.area_name}{c.location.pincode ? ` — ${c.location.pincode}` : ''}
                  </div>
                )}

                {c.images && c.images.length > 0 && (
                  <img
                    src={c.images[0].image_url}
                    alt='Complaint'
                    className='track-card-img'
                  />
                )}

                <div className='track-card-date'>
                  {new Date(c.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}