import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './Login.css';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: ''});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/login', form);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            res.data.user.role === 'admin' ? navigate('/admin') : navigate('/track');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
            setLoading(false);
        }
    };

    return (
        <div className='login-root'>
            {/* Left decorative panel */}
            <div className='login-left'>
                <span className='login-left-bg'>01</span>
                <Link to='/' className='login-left-brand'>
                    Public<span>Watch</span>
                </Link>
                <div className='login-left-copy'>
                    <h2>Report issues. <em>Drive change.</em></h2>
                    <p>Join thousands of citizens already making their neighborhoods better — one report at a time.</p>
                </div>
            </div>

            {/* Right form panel */}
            <div className='login-right'>
                <div className='login-form-wrap'>
                    <h2 className='login-title'>Welcome back</h2>
                    <p className='login-sub'>Login to your account</p>

                    {error && <div className='alert alert-error'>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className='field'>
                            <label className='label'>Email</label>
                            <input type='email' className='input' required
                                onChange={e => setForm({...form, email: e.target.value})} />
                        </div>
                        <div className='field'>
                            <label className='label'>Password</label>
                            <input type='password' className='input' required
                                onChange={e => setForm({...form, password: e.target.value})} />
                        </div>
                        <button type='submit' className='login-submit' disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className='login-footer'>
                        No account? <Link to='/register'>Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}