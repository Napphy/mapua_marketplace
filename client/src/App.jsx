import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; 
import './App.css';
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import { useAuth } from './contexts/AuthContext.jsx';

const App = () => {
  const { isAuthenticated } = useAuth();
  return (
  <Router>
    <Routes>
      <Route path='/' element={! isAuthenticated ? <Register /> : <Navigate to ='/dashboard' />}/>
      <Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to ='/dashboard' />}/>
      <Route path='/dashboard' element={isAuthenticated ? <Dashboard/>  : <Navigate to ='/login' />}/>
      <Route path='/home' element={isAuthenticated ? <Home /> : <Navigate to = '/login ' /> }/>
    </Routes>
  </Router>
  );
};

export default App;