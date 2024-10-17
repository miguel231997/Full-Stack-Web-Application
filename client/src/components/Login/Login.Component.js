import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const credentials = { username, password };

        const response = await fetch('http://localhost:8080/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.jwt_token);  // Save the JWT token to localStorage
            setIsLoggedIn(true);  // Update login state in App.js
            navigate('/tasks');  // Redirect to tasks page
        } else {
            alert('Login failed');
        }
    };

    return (
        <div>
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;