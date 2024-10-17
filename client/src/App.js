import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import Home from './components/Home/Home.Component';
import Login from './components/Login/Login.Component';
import Tasks from './components/Tasks/Tasks.Component';
import './App.css';
import Signup from './components/Signup/Signup.Component';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if a token exists in localStorage to determine if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // If token exists, set isLoggedIn to true
  }, []);

  // Logout function to clear the token and redirect
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/'); // Redirect to home after logout
  };

  // PrivateRoute component to guard routes
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/tasks">Tasks</Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <button onClick={handleLogout}>Sign Out</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </div>
  );
}

export default App;