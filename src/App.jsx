import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login           from './pages/Login';
import Register        from './pages/Register';
import AdminDashboard  from './pages/AdminDashboard';
import ReportComplaint from './pages/ReportComplaint';
import TrackComplaint  from './pages/TrackComplaint';
import AdminMap        from './pages/AdminMap';
import Feed            from './pages/Feed';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to='/login' />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'          element={<LandingPage/>} />
        <Route path='/login'     element={<Login />} />
        <Route path='/register'  element={<Register />} />
        <Route path='/feed'      element={<Feed />} />
        <Route path='/report'    element={<ReportComplaint />} />
        <Route path='/track'     element={<TrackComplaint />} />
        <Route path='/admin'     element={<AdminDashboard />} />
        <Route path='/admin/map' element={<AdminMap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;