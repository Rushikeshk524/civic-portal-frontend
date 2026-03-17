import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isAdmin = user?.role === 'admin';

    const handleLogout = async () => {
        try { await api.post('/logout'); } catch { }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className='nb-nav'>
            {/* Brand — Left */}
            <Link to='/' className='nb-brand'>
                    Issue Bridge
            </Link>

            {/* Nav Links — Center */}
            <div className='nb-center-links'>
                {user && !isAdmin && (
                    <>
                        <Link to='/report' className='nb-link'>Report Issue</Link>
                        <Link to='/feed' className='nb-link'>Community Feed</Link>
                        <Link to='/track' className='nb-link'>My Complaints</Link>
                    </>
                )}
                {user && isAdmin && (
                    <>
                        <Link to='/admin' className='nb-link'>Dashboard</Link>
                        <Link to='/admin/map' className='nb-link'>Map View</Link>
                    </>
                )}
            </div>

            {/* Auth — Right */}
            <div className='nb-right'>
                {user ? (
                    <>
                        <span className='nb-welcome-badge'>
                            Welcome, <span className='nb-welcome-name'>{user.full_name?.split(' ')[0]}</span>
                        </span>
                        <button className='nb-logout-btn' onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to='/login' className='nb-login-btn'>Login</Link>
                        <Link to='/register' className='nb-register-btn'>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
