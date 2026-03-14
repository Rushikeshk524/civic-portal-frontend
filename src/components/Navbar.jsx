import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Navbar(){
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isAdmin = user?.role === 'admin';

    const handleLogout = async () => {
        try { await api.post('/logout'); } catch {}
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className='navbar navbar-expand=lg navbar-dark bg-primary'>
            <div className ='conatiner'>
                <Link className='navbar-brand fw-bold' to='/'> Issue Bridge</Link>
                <div className='navbar-nav ms-auto d-flex flex-row align-items-center gap-3'>
                    {user ? (
                        <>
                            {!isAdmin && <Link className='nav-link text-white' to='/report'>Report Issue</Link>}
                            {!isAdmin && <Link className='nav-link text-white' to='/track'>My Complaints</Link>}
                            {isAdmin && <Link className='navlink text-white' to='/admin'>DashBoard</Link>}
                            {isAdmin && <Link className='nav-link text-white' to='/admin/map'>Map View</Link>}
                            <span className='text-white small'>Welcome, {user.full_name.split(' ')[0]}</span>
                            <button className='btn btn-outline-light btn-sm' onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link className='nav-link text-white' to='/login'>Login</Link>
                            <Link className='nav-link text-white' to='/register'>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}