import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';

export default function TrackComplaint() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    api.get('/complaints')
      .then(r => { setComplaints(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const borderColor = (status) => {
    if (status === 'resolved')    return '#198754';
    if (status === 'in_progress') return '#ffc107';
    return '#6c757d';
  };

  return (
    <>
      <Navbar />
      <div className='container mt-4'>

        <div className='d-flex justify-content-between align-items-center mb-4'>
          <h2 className='mb-0'>My Complaints</h2>
          <a href='/report' className='btn btn-dark btn-sm'>+ Report New Issue</a>
        </div>

        {loading && (
          <div className='text-center mt-5'>
            <div className='spinner-border text-primary' />
            <p className='mt-2 text-muted'>Loading...</p>
          </div>
        )}

        {!loading && complaints.length === 0 && (
          <div className='text-center mt-5'>
            <p className='text-muted fs-5'>No complaints submitted yet.</p>
          </div>
        )}

        <div className='row'>
          {complaints.map(c => (
            <div key={c.complaint_id} className='col-md-6 mb-3'>
              <div
                className='card shadow-sm h-100'
                style={{ borderLeft: `4px solid ${borderColor(c.status)}` }}
              >
                <div className='card-body'>

                  {/* Title + Status */}
                  <div className='d-flex justify-content-between align-items-start mb-2'>
                    <h6 className='card-title mb-0 me-2'>{c.title}</h6>
                    <StatusBadge status={c.status} />
                  </div>

                  {/* Description */}
                  <p className='small text-muted mb-2'>
                    {c.description?.substring(0, 80)}...
                  </p>

                  {/* Category */}
                  <p className='small mb-1'>
                    📁 <strong>{c.category?.category_name || 'N/A'}</strong>
                  </p>

                  {/* Department */}
                  <p className='small mb-1'>
                    🏢 <strong>{c.department?.department_name || 'Not assigned yet'}</strong>
                  </p>

                  {/* Location */}
                  <p className='small mb-1'>
                    📍 <strong>
                      {c.location
                        ? `${c.location.area_name}${c.location.pincode ? ' — ' + c.location.pincode : ''}`
                        : 'No location provided'
                      }
                    </strong>
                  </p>

                  {/* Date */}
                  <p className='small text-muted mb-0 mt-2'>
                    🗓️ {new Date(c.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>

                  {/*Image*/}
                  {c.images && c.images.length > 0 && (
                    <div className='mt-2'>
                      <img  
                        src={c.images[0].image_url}
                        alt='Complaint'
                        className='rounded border w-100'
                        style={{ maxHeight: '160px', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}