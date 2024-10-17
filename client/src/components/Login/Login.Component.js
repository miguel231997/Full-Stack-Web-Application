import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

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

        if(response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.jwt_token);
            navigate('/tasks');
        } else {
            alert('Login Failed')
        }
    }

    return (
        <div>
            <h1> Login Page </h1>
            <form onSubmit={ handleSubmit }>
                <div>
                    <label> Username </label>
                    <input type = "text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label> Password </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit"> Login </button>
            </form>
        </div>
    );
};

export default Login;