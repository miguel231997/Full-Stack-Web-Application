import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import Home from './components/Home/Home.Component';
import Login from './components/Login/Login.Component';
import Tasks from './components/Tasks/Tasks.Component';
import Signup from './components/Signup/Signup.Component';
import CreateTask from './components/CreateTask/CreateTask.Component';
import TaskDetail from './components/TaskDetail/TaskDetail.Component';
import EditTask from './components/EditTask/EditTask.Component';
import UserAdmin from './components/UserAdmin/UserAdmin.Component'; // Admin component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const roles = decodedToken.authorities || [];
      setIsAdmin(roles.includes('ROLE_ADMIN'));
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/');
  };

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">Task Manager</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tasks">Tasks</Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/users">Manage Users</Link>
              </li>
            )}
            {isLoggedIn ? (
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={handleLogout}>Sign Out</button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <div className="container mt-5">
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
    </div>
  );
}

export default App;