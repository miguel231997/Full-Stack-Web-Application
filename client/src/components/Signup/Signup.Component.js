import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const credentials = { username, password, email };

        const response = await fetch('http://localhost:8080/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (response.ok) {
            navigate('/login');
        } else {
            alert('Signup failed');
        }
    };

    return (
        <div>
            <h1> Signup Page </h1>
            <form onSubmit={ handleSubmit }>
                <div>
                    <label> Username </label>
                    <input type = "text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label> Password </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <label> Email </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button type="submit"> Sign Up </button>
            </form>
        </div>
    );
};


export default Signup;