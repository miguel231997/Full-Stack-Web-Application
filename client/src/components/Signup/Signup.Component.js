import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // State for role selection
    const [adminCode, setAdminCode] = useState(''); // State for admin code
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const credentials = { username, password, email };

        // Add adminCode to the request body only if admin is selected
        if (isAdmin) {
            credentials.code = adminCode;
        }

        const response = await fetch('http://localhost:8080/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (response.ok) {
            navigate('/login'); // Redirect to login page upon successful signup
        } else {
            alert('Signup failed');
        }
    };

    return (
        <div>
            <h1>Signup Page</h1>
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
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="user"
                            checked={!isAdmin}
                            onChange={() => setIsAdmin(false)}
                        />
                        Register as User
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="admin"
                            checked={isAdmin}
                            onChange={() => setIsAdmin(true)}
                        />
                        Register as Admin
                    </label>
                </div>
                {isAdmin && (
                    <div>
                        <label>Admin Code</label>
                        <input
                            type="text"
                            value={adminCode}
                            onChange={(e) => setAdminCode(e.target.value)}
                            placeholder="Enter admin code"
                            required={isAdmin}
                        />
                    </div>
                )}

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;