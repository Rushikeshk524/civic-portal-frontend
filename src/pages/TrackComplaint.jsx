import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';

export default function TrackComplaint() {
    const [complaints, setCompliants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        api.get('/complaints')
            .then(r => {setComplaints(r.data); setLoading(false); })
            .catch(() => setLoading(false));
        }, []);
     return (
        <>
            <Navbar/>
            <div className='container mt-4'>
                <h2 className='mb-4'>My Complaints</h2>

                {loading && <p className='text-muted'>Loading...</p>}

                {!loading && complaints.length === 0 && (
                    <div className='text-center mt-5'>
                        <h5 className='text-muted'>No complaints submitted yet</h5>
                        <a href='/report' className='btn btn-primary mt-3'>Report an Issue</a>
                    </div>
                )}

                <div className='row'>
                    {complaints.map(c => (
                        <div key={c.complaint_id} className='col-md-6 mb-3'>
                            <div className='card shadow-sm h-100'
                                style={{ cursor: 'pointer', borderLeft: `4px solid ${
                                    c.status ==='resolved' ? '#198754' :
                                    c.status ==='in_progress' ? '#ffc107' : '#6c757d'
                                }`}}
                                onClick={() => setSelected(c)}
                            >
                                <div className='card-body'>
                                    <div className='d-flex justify-content-between align-items-start mb-2'>
                                        <h6 className='card-title mb-0'>{c.title}</h6>
                                        <StatusBadge status={c.status}/>
                                    </div>
                                    <p className='text-muted small mb-2'>
                                        {c.category?.category_name}
                                    </p>
                                    <p className='card-text small'>
                                        {c.description?.substring(0,80)}...
                                    </p>
                                    {c.address && (
                                        <p className='small text-secondary mb-1'> {c.address}</p>
                                    )}
                                    {c.department && (
                                        <p className='small text-success mb-1'>
                                            Assigned to: {c.department.department_name}
                                        </p>
                                    )}
                                    <small className='text-muted'>
                                        Submitted: {new Date(c.created_at).toLocaleDateString('en-IN')}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/*Detail Modal*/}{
                selected && (
                    <div className='modal show d-block' style={{ backgroundColor: 'rgba(0,0,0,0.5'}}>
                        <div className='modal-dialog modal-lg'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <h5 className='modal-title'>{selected.title}</h5>
                                    <button className='btn-close' onClick={() => setSelected(null)} />
                                </div>
                                <div className='modal-body'>
                                    <div className='row mb-3'>
                                        <div className='col-6'>
                                            <small className='text-muted'>Status</small>
                                            <div><StatusBadge status={selected.status}/></div>
                                        </div>
                                        <div className='col-6'>
                                            <small className='text-muted'>Category</small>
                                            <div>{selected.category?.category_name}</div>
                                        </div>
                                    </div>

                                    <div className='mb-3'>
                                        <small className='text-muted'>Description</small>
                                        <p>{selected.description}</p>
                                    </div>

                                    {selected.address && (
                                        <div className='mb-3'>
                                            <small className='text-muted'>Location</small>
                                            <p> {selected.address}</p>
                                        </div>
                                    )}

                                    {selected.department && (
                                        <div className='mb-3'>
                                            <small className='text-muted'>Assigned Department</small>
                                            <p>{selected.department.department_name}</p>
                                        </div>
                                    )}

                                    <div className='mb-3'>
                                        <small className='text-muted'>Submitted On</small>
                                        <p>{new Date(selected.created_at).toLocaleDateString('en-IN')}</p>
                                    </div>
                                </div>
                                <div className='modal-footer'>
                                    <button className='btn btn-secondary' onClick={() => setSelected(null)}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
     );
}