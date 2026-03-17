import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';

export default function Feed() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [openComments, setOpenComments] = useState({});
  const [commentText, setCommentText]   = useState({});

  const loadFeed = () => {
    api.get('/feed')
      .then(r => { setComplaints(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadFeed(); }, []);

  const handleLike = async (id) => {
    try {
      const res = await api.post(`/complaints/${id}/like`);
      setComplaints(prev => prev.map(c =>
        c.complaint_id === id
          ? { ...c, likes_count: res.data.count, liked_by_me: res.data.liked }
          : c
      ));
    } catch {}
  };

  const toggleComments = (id) => {
    setOpenComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleComment = async (id) => {
    const text = commentText[id];
    if (!text?.trim()) return;
    try {
      const res = await api.post(`/complaints/${id}/comments`, {
        comment_text: text
      });
      setComplaints(prev => prev.map(c =>
        c.complaint_id === id
          ? {
              ...c,
              comments: [...(c.comments || []), res.data.comment],
              comments_count: c.comments_count + 1
            }
          : c
      ));
      setCommentText(prev => ({ ...prev, [id]: '' }));
    } catch {}
  };

  const borderColor = (status) => {
    if (status === 'resolved')    return '#198754';
    if (status === 'in_progress') return '#ffc107';
    return '#6c757d';
  };

  return (
    <>
      <Navbar />
      <div className='container mt-4' style={{ maxWidth: '700px' }}>
        <h2 className='mb-4'>Community Feed</h2>

        {loading && (
          <div className='text-center mt-5'>
            <div className='spinner-border text-primary' />
            <p className='mt-2 text-muted'>Loading feed...</p>
          </div>
        )}

        {!loading && complaints.length === 0 && (
          <div className='alert alert-info'>
            No complaints yet. Be the first to report an issue!
          </div>
        )}

        {complaints.map(c => (
          <div
            key={c.complaint_id}
            className='card shadow-sm mb-4'
            style={{ borderLeft: `4px solid ${borderColor(c.status)}` }}
          >
            <div className='card-body'>

              {/* Header — author + status */}
              <div className='d-flex justify-content-between align-items-start mb-2'>
                <div className='d-flex align-items-center gap-2'>
                  <div
                    className='rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold'
                    style={{ width: '38px', height: '38px', fontSize: '1rem', flexShrink: 0 }}
                  >
                    {c.user?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className='fw-bold small'>{c.user?.full_name}</div>
                    <div className='text-muted' style={{ fontSize: '0.75rem' }}>
                      {new Date(c.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>

              {/* Title + Description */}
              <h6 className='fw-bold mb-1'>{c.title}</h6>
              <p className='text-muted small mb-2'>{c.description}</p>

              {/* Category + Department + Location */}
              <div className='d-flex flex-wrap gap-2 mb-2'>
                <span className='badge bg-light text-dark border'>
                  📁 {c.category?.category_name}
                </span>
                {c.department && (
                  <span className='badge bg-light text-dark border'>
                    🏢 {c.department.department_name}
                  </span>
                )}
                {c.location && (
                  <span className='badge bg-light text-dark border'>
                    📍 {c.location.area_name}
                    {c.location.pincode ? ` — ${c.location.pincode}` : ''}
                  </span>
                )}
              </div>

              {/* Image */}
              {c.images && c.images.length > 0 && (
                <img
                  src={c.images[0].image_url}
                  alt='Complaint'
                  className='rounded border w-100 mb-2'
                  style={{ maxHeight: '250px', objectFit: 'cover' }}
                />
              )}

              {/* Like + Comment buttons */}
              <div className='d-flex gap-3 mt-2 pt-2 border-top'>
                <button
                  className={`btn btn-sm ${c.liked_by_me ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleLike(c.complaint_id)}
                >
                  👍 {c.likes_count || 0} {c.liked_by_me ? 'Liked' : 'Like'}
                </button>
                <button
                  className='btn btn-sm btn-outline-secondary'
                  onClick={() => toggleComments(c.complaint_id)}
                >
                  💬 {c.comments_count || 0} Comments
                </button>
              </div>

              {/* Comments Section */}
              {openComments[c.complaint_id] && (
                <div className='mt-3'>

                  {/* Existing Comments */}
                  {c.comments && c.comments.length > 0 ? (
                    c.comments.map(comment => (
                      <div
                        key={comment.comment_id}
                        className='d-flex gap-2 mb-2'
                      >
                        <div
                          className='rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0'
                          style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}
                        >
                          {comment.user?.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className='bg-light rounded p-2 flex-grow-1'>
                          <div className='fw-bold' style={{ fontSize: '0.8rem' }}>
                            {comment.user?.full_name}
                          </div>
                          <div style={{ fontSize: '0.85rem' }}>
                            {comment.comment_text}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='text-muted small'>No comments yet — be the first!</p>
                  )}

                  {/* Add Comment */}
                  <div className='d-flex gap-2 mt-2'>
                    <input
                      type='text'
                      className='form-control form-control-sm'
                      placeholder='Write a comment...'
                      value={commentText[c.complaint_id] || ''}
                      onChange={e => setCommentText(prev => ({
                        ...prev,
                        [c.complaint_id]: e.target.value
                      }))}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleComment(c.complaint_id);
                      }}
                    />
                    <button
                      className='btn btn-sm btn-primary'
                      onClick={() => handleComment(c.complaint_id)}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>
    </>
  );
}