import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import Home from './components/Home/Home.Component';
import Login from './components/Login/Login.Component';
import Tasks from './components/Tasks/Tasks.Component';
import './App.css';
import Signup from './components/Signup/Signup.Component';
import CreateTask from './components/CreateTask/CreateTask.Component';
import TaskDetail from './components/TaskDetail/TaskDetail.Component'; // Import Task Detail
import EditTask from './components/EditTask/EditTask.Component'; // Import Edit Task
import UserAdmin from './components/UserAdmin/UserAdmin.Component'; // Admin component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Check if a token exists in localStorage to determine if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);  // User is logged in

      // Decode the token to check if the user is an admin
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const roles = decodedToken.authorities || [];
      setIsAdmin(roles.includes('ROLE_ADMIN'));  // Check if the user has admin role
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  // Logout function to clear the token and redirect
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
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
          { isAdmin && (
            <li>
              <Link to="/admin/users">Manage Users</Link>
            </li>
          )}
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
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
        <Route path="/register" element={<Signup setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
        <Route path="/create-task" element={<PrivateRoute><CreateTask /></PrivateRoute>} />
        <Route path="/tasks/:taskId" element={<PrivateRoute><TaskDetail /></PrivateRoute>} />
        <Route path="/tasks/edit/:taskId" element={<PrivateRoute><EditTask /></PrivateRoute>} />
        <Route path="/admin/users" element={isAdmin ? <UserAdmin /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;