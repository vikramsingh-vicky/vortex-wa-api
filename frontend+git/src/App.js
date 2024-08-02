import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react'
import './App.css';
import QRCode from './components/whatsapp/qrcode';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Forget from './components/auth/ForgetPass';
import Dashboard from './components/dashboard/dashboard';
import Profile from './components/profile/Profile';
import CompanyDetails from './components/profile/CompanyDetails';
import Subscription from './components/billing/Subscription';
import Logs from './components/whatsapp/logs'
import AdminDashboard from './components/dashboard/adminDashboard';
import CreateTicket from './components/dashboard/tickets/createTicket';
import ViewTickets from './components/dashboard/tickets/viewTickets';
import TicketDetails from './components/dashboard/tickets/TicketDetails';

function App() {
  
  // var apiUrl = '';
  // if(process.env.REACT_APP_SERVER_STATE === "development") {
  //   apiUrl = process.env.REACT_APP_LOCAL_API;
  // } else {
  //   apiUrl = process.env.REACT_APP_PROD_API;
  // }
  // const exchapi = process.env.REACT_APP_EXCHANGE_API;
  // const rzpkey = process.env.REACT_APP_RZP_KEY;

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/waqr" element={<QRCode />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path='/forget' element={<Forget />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path="/dashboard/subscriptions" element={<Subscription />} />
          <Route path="/dashboard/createTicket" element={<CreateTicket />} />
          <Route path="/dashboard/viewTickets" element={<ViewTickets />} />
          <Route path='/adminDash' element={<AdminDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/company" element={<CompanyDetails />} />
          <Route path="/developers/logs" element={<Logs />} />
          <Route path="/ticket" element={<TicketDetails />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
