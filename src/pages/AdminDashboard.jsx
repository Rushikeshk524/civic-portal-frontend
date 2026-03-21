import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import './AdminDashboard.css';


export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats]           = useState({ total:0, pending:0, in_progress:0, resolved:0 });
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all');
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');

  const loadAll = (deptId = selectedDept) => {
    setLoading(true);
    api.get('/admin/complaints', { params: { department_id: deptId } })
      .then(r => { setComplaints(r.data); setLoading(false); });
    api.get('/admin/stats').then(r => setStats(r.data));
  };

  useEffect(() => {
    api.get('/departments')
      .then(r => setDepartments(r.data))
      .catch(err => console.error("Error fetching departments", err));
    loadAll();
  }, []);

  useEffect(() => {
    loadAll();
  }, [selectedDept]);

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
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await api.delete(`/admin/complaints/${id}`);
      loadAll();
    } catch (err) {
      alert('Failed to delete complaint');
    }
  };

  const filtered = filter === 'all'
    ? complaints
    : complaints.filter(c => c.status === filter);

  const STAT_FILTERS = [
    { label: 'Total',       val: stats.total,       key: 'all' },
    { label: 'Pending',     val: stats.pending,     key: 'pending' },
    { label: 'In Progress', val: stats.in_progress, key: 'in_progress' },
    { label: 'Resolved',    val: stats.resolved,    key: 'resolved' },
  ];

  return (
    <>
      <Navbar />
      <div className='pw-page'>
        <div className='pw-container'>
          <div className='adm-hd'>
            <div>
              <div className='section-label'>Admin Panel</div>
              <h2>Admin Dashboard</h2>
            </div>
            <div className='adm-hd-filters'>
              <select 
                className='adm-select'
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value=''>All Departments</option>
                {departments.map(dept => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className='adm-stats'>
            {STAT_FILTERS.map(s => (
              <div
                key={s.label}
                className={`stat-card${filter === s.key ? ' active' : ''}`}
                onClick={() => setFilter(s.key)}
              >
                <div className='stat-num'>{s.val}</div>
                <div className='stat-lbl'>{s.label}</div>
              </div>
            ))}
          </div>
          {/* Table */}
          {loading ? (
            <div className='loading-center'><div className='spinner' /><span>Loading complaints...</span></div>
          ) : filtered.length === 0 ? (
            <div className='alert alert-info'>No complaints found.</div>
          ) : (
            <div className='adm-table-panel'>
              <div className='table-wrap'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Submitted By</th>
                      <th>Status</th>
                      <th>Assign Dept</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(c => (
                      <tr key={c.complaint_id}>
                        <td>{c.complaint_id}</td>
                        <td>
                          <div className='adm-issue-cell'>
                            <div>
                              <span className='adm-issue-title'>{c.title}</span>
                              <span className='adm-issue-desc'>{c.description?.substring(0, 50)}...</span>
                            </div>
                            {c.images && c.images.length > 0 && (
                              <img
                                src={c.images[0].image_url}
                                alt='Issue'
                                className='adm-thumb'
                              />
                            )}
                          </div>
                        </td>
                        <td>{c.category?.category_name}</td>
                        <td>
                          <div className="adm-address-cell">
                            {c.location
                              ? `${c.location.area_name}${c.location.pincode ? ' — ' + c.location.pincode : ''}`
                              : 'No location'}
                          </div>
                        </td>
                        <td>{c.user?.full_name}</td>
                        <td><StatusBadge status={c.status} /></td>
                        <td>
                          <select
                            className='adm-select'
                            defaultValue={c.department?.department_id || ''}
                            onChange={e => assignDept(c.complaint_id, e.target.value)}
                          >
                            <option value=''>Not assigned</option>
                            {departments.map(d => (
                              <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div className='adm-action-row'>
                            {c.status !== 'in_progress' && (
                              <button
                                className='adm-btn adm-btn-warn'
                                onClick={() => updateStatus(c.complaint_id, 'in_progress')}
                              >
                                In Progress
                              </button>
                            )}
                            {c.status !== 'resolved' && (
                              <button
                                className='adm-btn adm-btn-ok'
                                onClick={() => updateStatus(c.complaint_id, 'resolved')}
                              >
                                Resolve
                              </button>
                            )}
                            <button
                              className='adm-btn adm-btn-del'
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}