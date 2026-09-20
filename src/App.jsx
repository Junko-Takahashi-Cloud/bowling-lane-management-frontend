import Reservations from './pages/Reservations';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StaffLogin from './pages/StaffLogin';
import Home from './pages/Home';
import Checkin from './pages/Checkin';
import ClassAttendance from './pages/ClassAttendance';
import LaneStatus from './pages/LaneStatus';
import Sales from './pages/Sales';
import CoachShifts from './pages/CoachShifts';
import StaffAttendance from './pages/StaffAttendance';
import './App.css';

function Placeholder({ title }) {
  return <div style={{ padding: '40px' }}><h2>{title}(準備中)</h2></div>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StaffLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/checkin" element={<Checkin />} />
        <Route path="/class-attendance" element={<ClassAttendance />} />
        <Route path="/lanes" element={<LaneStatus />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/coach-shifts" element={<CoachShifts />} />
        <Route path="/staff-attendance" element={<StaffAttendance />} />        
      </Routes>
    </BrowserRouter>
  );
}

export default App;