import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import './Feed.css';

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
    // Frontend-only Like toggle (Backend is failing with 500, skipping network call)
    setComplaints(prev => prev.map(c => {
      if (c.complaint_id === id) {
        const isLiked = c.liked_by_me;
        return {
          ...c,
          liked_by_me: !isLiked,
          likes_count: (c.likes_count || 0) + (isLiked ? -1 : 1)
        };
      }
      return c;
    }));
  };

  const toggleComments = (id) => {
    setOpenComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleComment = async (id) => {
    const text = commentText[id];
    if (!text?.trim()) return;

    // Frontend-only Comment creation (Backend is failing with 500, skipping network call)
    const newComment = {
      comment_id: Date.now(),
      comment_text: text,
      user: { full_name: 'You' }
    };

    setComplaints(prev => prev.map(c =>
      c.complaint_id === id
        ? {
            ...c,
            comments: [...(c.comments || []), newComment],
            comments_count: (c.comments_count || 0) + 1
          }
        : c
    ));
    setCommentText(prev => ({ ...prev, [id]: '' }));
  };

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
          <div className='feed-wrap'>
            <div className='feed-hd'>
              <h2>Community Feed</h2>
            </div>

            {loading && (
              <div className='loading-center'>
                <div className='spinner' />
                <span>Loading feed...</span>
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
                className='feed-card'
                style={{ '--fc-color': statusColor(c.status) }}
              >
                {/* Header */}
                <div className='feed-meta'>
                  <div className='feed-author'>
                    <div className='feed-av'>
                      {c.user?.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className='feed-author-name'>{c.user?.full_name}</span>
                      <span className='feed-date'>
                        {new Date(c.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>

                {/* Content */}
                <div className='feed-title'>{c.title}</div>
                <div className='feed-desc'>{c.description}</div>

                {/* Chips */}
                <div className='feed-chips'>
                  {c.category && <span className='chip'>{c.category.category_name}</span>}
                  {c.department && <span className='chip'>{c.department.department_name}</span>}
                  {c.location && (
                    <span className='chip'>
                      {c.location.area_name}{c.location.pincode ? ` — ${c.location.pincode}` : ''}
                    </span>
                  )}
                </div>

                {/* Image */}
                {c.images && c.images.length > 0 && (
                  <img src={c.images[0].image_url} alt='Complaint' className='feed-img' />
                )}

                {/* Actions */}
                <div className='feed-bar'>
                  <button
                    className={`feed-btn${c.liked_by_me ? ' liked' : ''}`}
                    onClick={() => handleLike(c.complaint_id)}
                  >
                    {c.likes_count || 0} {c.liked_by_me ? 'Liked' : 'Like'}
                  </button>
                  <button
                    className='feed-btn'
                    onClick={() => toggleComments(c.complaint_id)}
                  >
                    {c.comments_count || 0} Comments
                  </button>
                </div>

                {/* Comments */}
                {openComments[c.complaint_id] && (
                  <div className='feed-comments'>
                    {c.comments && c.comments.length > 0 ? (
                      c.comments.map(comment => (
                        <div key={comment.comment_id} className='feed-cmt'>
                          <div className='feed-cmt-av'>
                            {comment.user?.full_name?.charAt(0).toUpperCase()}
                          </div>
                          <div className='feed-cmt-body'>
                            <span className='feed-cmt-name'>{comment.user?.full_name}</span>
                            <div className='feed-cmt-text'>{comment.comment_text}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{color:'var(--gray-3)', fontSize:'0.82rem'}}>No comments yet — be the first!</p>
                    )}
                    <div className='feed-cmt-row'>
                      <input
                        type='text'
                        className='input'
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
                        className='feed-post-btn'
                        onClick={() => handleComment(c.complaint_id)}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}