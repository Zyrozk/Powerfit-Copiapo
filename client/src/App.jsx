import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavbarPublic from './components/layout/NavbarPublic';
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Dashboard from './pages/user/Dashboard';
import Memberships from './pages/user/Memberships';
import ConfirmMembership from './pages/user/ConfirmMembership';
import PaymentMethod from './pages/user/PaymentMethod';
import Classes from './pages/user/Classes';
import ClassBooking from './pages/user/ClassBooking';
import PaymentChoice from './pages/user/PaymentChoice';
import Profile from './pages/user/Profile';
import History from './pages/user/History';
import MyMembership from './pages/user/MyMembership';
import CoachPanel from "./pages/coach/CoachPanel";
import ManageUsers from './pages/coach/ManageUsers';
import ManageMemberships from './pages/coach/ManageMemberships';
import ManageSchedule from './pages/coach/ManageSchedule';
import ManageCoaches from './pages/coach/ManageCoaches';
import CreateCoach from './pages/coach/CreateCoach';
import ManagePayments from './pages/coach/ManagePayments';
import EditCoach from "./pages/coach/EditCoach";
import ManageAttendance from "./pages/coach/ManageAttendance";
import Statistics from "./pages/coach/Statistics";
import AttendanceQR from "./pages/coach/AttendanceQR";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* GRUPO 1: Rutas Públicas*/}
        <Route element={<NavbarPublic />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* GRUPO 2: Rutas Privadas*/}
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/user/memberships" element={<Memberships />} />
        <Route path="/user/memberships/confirm" element={<ConfirmMembership />} />
        <Route path="/user/memberships/payment-method" element={<PaymentMethod />} />
        <Route path="/user/classes" element={<Classes />} />
        <Route path="/user/classes/booking" element={<ClassBooking />} />
        <Route path="/user/checkout" element={<PaymentChoice />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/history" element={<History />} />
        <Route path="/user/mymembership" element={<MyMembership />} />
         
        {/* GRUPO 3: Rutas para Coaches */}
        <Route path="/coach/panel" element={<CoachPanel />} />
        <Route path="/coach/manage-users" element={<ManageUsers />} />
        <Route path="/coach/manage-memberships" element={<ManageMemberships />} />
        <Route path="/coach/schedule" element={<ManageSchedule />} />
        <Route path="/coach/coaches" element={<ManageCoaches />} />
        <Route path="/coach/payments" element={<ManagePayments />} />
        <Route path="/coach/create" element={<CreateCoach />} />
        <Route path="/coach/edit/:id" element={<EditCoach />} />
        <Route path="/coach/asistencia" element={<ManageAttendance />} />
        <Route path="/coach/statistics" element={<Statistics />} />
        <Route path="/coach/attendance-qr" element={<AttendanceQR />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;