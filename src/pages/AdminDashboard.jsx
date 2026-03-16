import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';

const DEPARTMENTS = [
  { id: 1, name: 'Roads & Infrastructure' },
  { id: 2, name: 'Sanitation Department' },
  { id: 3, name: 'Water Supply Board' },
  { id: 4, name: 'Electricity Department' },
];

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats]           = useState({ total:0, pending:0, in_progress:0, resolved:0 });
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all');

  const loadAll = () => {
    api.get('/admin/complaints').then(r => { setComplaints(r.data); setLoading(false); });
    api.get('/admin/stats').then(r => setStats(r.data));
  };

  useEffect(() => { loadAll(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/admin/complaints/${id}/status`, { status });
    loadAll();
  };

  const assignDept = async (id, dept_id) => {
    if (!dept_id) return;
    await api.patch(`/admin/complaints/${id}/assign`, { department_id: parseInt(dept_id) });
    loadAll();
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comaplint?')) return;
    try {
      await api.delete(`/admin/complaints/${id}`);
      loadAll();
    } catch (err) {
      alert('Failed to delete comaplint');
    }
  };

  const filtered = filter === 'all'
    ? complaints
    : complaints.filter(c => c.status === filter);

  return (
    <>
      <Navbar />
      <div className='container mt-4'>
        <h2 className='mb-4'>Admin Dashboard</h2>

        {/* Stats Cards */}
        <div className='row mb-4 g-3'>
          {[
            { label: 'Total',       val: stats.total,       color: 'bg-primary',   filter: 'all' },
            { label: 'Pending',     val: stats.pending,     color: 'bg-secondary', filter: 'pending' },
            { label: 'In Progress', val: stats.in_progress, color: 'bg-warning',   filter: 'in_progress' },
            { label: 'Resolved',    val: stats.resolved,    color: 'bg-success',   filter: 'resolved' },
          ].map(s => (
            <div key={s.label} className='col-6 col-md-3'>
              <div
                className={`card ${s.color} text-white text-center p-3`}
                style={{ cursor: 'pointer' }}
                onClick={() => setFilter(s.filter)}
              >
                <h2 className='mb-0'>{s.val}</h2>
                <small>{s.label}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className='mb-3'>
          <div className='btn-group'>
            {['all', 'pending', 'in_progress', 'resolved'].map(f => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Table */}
        {loading ? (
          <p className='text-muted'>Loading complaints...</p>
        ) : filtered.length === 0 ? (
          <div className='alert alert-info'>No complaints found.</div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-hover align-middle'>
              <thead className='table-dark'>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Submitted By</th>
                  <th>Assign Dept</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.complaint_id}>
                    <td>{c.complaint_id}</td>
                    <td>
                      <strong>{c.title}</strong>
                      <br />
                      <small className='text-muted'>{c.description?.substring(0, 50)}...</small>
                    {c.images && c.images.legth > 0 && (
                      <div className='mt-1'>
                        <img
                          src={c.images[0].image_url}
                          alt='Issue'
                          className='rounded border'
                          style={{width: '60px', height: '40px', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    </td>
                    <td>{c.category?.category_name}</td>
                    <td>
                      {c.location
                        ? `${c.location.area_name}${c.location.pincode ? ' - ' + c.location.pincode : ''}`
                        : 'No location'
                        }
                    </td>
                    <td>{c.user?.full_name}</td>
                    <td>
                      <select
                        className='form-select form-select-sm'
                        defaultValue={c.department?.department_id || ''}
                        onChange={e => assignDept(c.complaint_id, e.target.value)}
                      >
                        <option value=''>Not assigned</option>
                        {DEPARTMENTS.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className='d-flex gap-1'>
                        {c.status !== 'in_progress' && (
                          <button
                            className='btn btn-sm btn-outline-warning'
                            onClick={() => updateStatus(c.complaint_id, 'in_progress')}
                          >
                            In Progress
                          </button>
                        )}
                        {c.status !== 'resolved' && (
                          <button
                            className='btn btn-sm btn-success'
                            onClick={() => updateStatus(c.complaint_id, 'resolved')}
                          >
                            Resolve
                          </button>
                        )}
                        <button className='btn btn-sm btn-danger'
                        onClick={() => deleteComplaint(c.complaint_id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}