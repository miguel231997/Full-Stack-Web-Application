import React from 'react';
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './components/Home/Home.Component';
import Login from './components/Login/Login.Component';
import Tasks from './components/Tasks/Tasks.Component';
import './App.css';
import Signup from './components/Signup/Signup.Component';

function App() {

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/"> Home </Link>
          </li>
          <li>
            <Link to="/tasks"> Taks </Link>
          </li>
          <li>
            <Link to="/login"> Login </Link>
          </li>
          <li>
            <Link to="/register"> Sign Up </Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
      </Routes>

    </div>
  );
}

export default App;
