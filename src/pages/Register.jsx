import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Register() {
    const [form, setForm] = useState({
        full_name: '', email: '', password: '',
        password_confirmation: '', phone:'', role: 'citizen'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/register', from);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/track');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className='container mt-5'>
                <div className='row justify-content-center'>
                    <div className='col-md-6'>
                        <div className='card shadow'></div>
                            <div className='card-body p-4'>
                                <h3 className='text-center mb-1'>Create Account</h3>
                                <p className='text-center text-muted mb-4'>Join IssueBridge today</p>
                                {error && <div className='alert alert-danger'>{error}</div>}
                                <form onSubmit={handleSubmit}>
                                    <div className='mb-3'>
                                        <label className='form-label'>Full Name</label>
                                        <input className='form-control' type='text' required onChange={e => setForm({...form, full_name: e.target.value})} />
                                    </div>
                                    <div className='md-3'>
                                        <label className='form-label'>Email</label>
                                        <input type='email' className='form-control' required onChange={e => setForm({...form, email: e.target.value})}/>
                                    </div>
                                    <div className='mb-3'>
                                        <label className='form-label'>Phone <span className='text-muted'>(optional)</span></label>
                                        <input type='text' className='form-control'
                                        onChange={e => setForm({...form, phone: e.target.value})} />
                                    </div>
                                    <div className='row'>
                                        <div className='col-md-6 mb-3'>
                                            <label className='form-label'>Password</label>
                                            <input type='password' className='form-control' required onChange={e => setForm({...form,password: e.target.value})} />
                                        </div>
                                        <div className='col-md-6 mb-3'>
                                            <label className='form-label'>Confirm Password</label>
                                            <input type='password' className='form-control' required onChange={e => setForm({...form, password_confirmation: e.target.value})} />
                                        </div>
                                    </div>
                                    <button type='submit' className='btn btn-success w-100' disabled={loading}>
                                        {loading ? 'Creating account...' : 'Create Account'}
                                    </button>
                                </form>
                                <p className='text-center mt-3 mb-0'>
                                    Already have an Account? <Link to='/login'>Login</Link>
                                </p>
                            </div>
                    </div>
                </div>
            </div>
        </>
    );
}