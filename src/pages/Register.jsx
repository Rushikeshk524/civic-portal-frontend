import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './Register.css';

export default function Register() {
  const [form, setForm] = useState({
    full_name: '', email: '', password: '',
    password_confirmation: '', phone: '', role: 'citizen'
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/track');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className='reg-root'>
      {/* Left decorative panel */}
      <div className='reg-left'>
        <span className='reg-left-bg'>02</span>
        <Link to='/' className='reg-left-brand'>
          Civic<span>Portal</span>
        </Link>
        <div className='reg-left-copy'>
          <h2>Your city. <em>Your voice.</em></h2>
          <p>Create an account and start making a difference in your community today.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className='reg-right'>
        <div className='reg-form-wrap'>
          <h2 className='reg-title'>Create Account</h2>
          <p className='reg-sub'>Join Civic Portal today</p>

          {error && <div className='alert alert-error'>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className='field'>
              <label className='label'>Full Name</label>
              <input type='text' className='input' required
                onChange={e => setForm({...form, full_name: e.target.value})} />
            </div>
            <div className='field'>
              <label className='label'>Email</label>
              <input type='email' className='input' required
                onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className='field'>
              <label className='label'>Phone <span style={{color:'var(--gray-3)', fontWeight:400, textTransform:'none', letterSpacing:0}}>(optional)</span></label>
              <input type='text' className='input'
                onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className='reg-row'>
              <div className='field'>
                <label className='label'>Password</label>
                <input type='password' className='input' required
                  onChange={e => setForm({...form, password: e.target.value})} />
              </div>
              <div className='field'>
                <label className='label'>Confirm Password</label>
                <input type='password' className='input' required
                  onChange={e => setForm({...form, password_confirmation: e.target.value})} />
              </div>
            </div>
            <button type='submit' className='reg-submit' disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className='reg-footer'>
            Already have an account? <Link to='/login'>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}