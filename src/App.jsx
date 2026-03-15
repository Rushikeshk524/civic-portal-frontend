import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login          from './pages/Login';
import Register       from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ReportComplaint from './pages/ReportComplaint';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to='/login' />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'         element={<Navigate to='/login' />} />
        <Route path='/login'    element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/admin'    element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path='/report' element={<PrivateRoute><ReportComplaint/></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;