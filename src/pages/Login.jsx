import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

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
        <>
            <Navbar/>
            <div className='container mt-5'>
                <div className='row justify-content-center'>
                    <div className='col-md-5'>
                        <div className='card-shadow'>
                            <div className='card-body p-4'>
                                <h3 className='text-center mb-1'>Welcome back</h3>
                                <p className='text-center text-muted mb-4'>Login to your account</p>
                                {error && <div className='alert alert-danger'>{error}</div>}
                                <form onSubmit={handleSubmit}>
                                    <div className='mb-3'>
                                        <label className='form-label'>Email</label>
                                        <input type='email' className='form-control' required 
                                        onChange={e => setForm({...form, email: e.target.value})} />
                                    </div>
                                    <div className='mb-3'>
                                        <label className='form-label'>Password</label>
                                        <input type='password' className='form-control' required onChange={e => setForm({...form, password: e.target.value})}/>
                                    </div>
                                    <button type='submit' className='btn btn-primary w-100' disabled={loading}>
                                        {loading ? 'Logging in...' : 'Login'}
                                    </button>
                                </form>
                                <p className='text-center mt-3 mb-0'>
                                    No account ? <Link to='/register'>Register here</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}