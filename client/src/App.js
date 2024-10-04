import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home/Home.Component';
import Login from './components/Login/Login.Component';
import Tasks from './components/Tasks/Tasks.Component';
import './App.css';

function App() {
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
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/login" element={<Login />} />
      </Routes>

    </div>
  );
}

export default App;
