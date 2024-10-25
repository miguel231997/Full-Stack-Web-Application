import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = ({ setIsLoggedIn, setIsAdmin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setSignupAdmin] = useState(false); // Whether the user is signing up as admin
    const [adminCode, setAdminCode] = useState('');    // Admin code
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const credentials = { username, password, email };

        // If user tries to sign up as admin, add the admin code
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
            const data = await response.json();
            localStorage.setItem('token', data.jwt_token);  // Store the JWT token in localStorage

            // Set the user as logged in
            setIsLoggedIn(true);

            // Decode the token to check for the admin role
            const decodedToken = JSON.parse(atob(data.jwt_token.split('.')[1]));
            const roles = decodedToken.authorities || [];

            // Check if the user is an admin and update state
            setIsAdmin(roles.includes('ROLE_ADMIN'));

            navigate('/tasks');  // Redirect to tasks page
        } else {
            alert('Signup failed');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Signup Page</h1>
            <form onSubmit={handleSubmit} className="w-50 mx-auto">
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        checked={isAdmin}
                        onChange={() => setSignupAdmin(!isAdmin)}
                    />
                    <label className="form-check-label">Register as Admin</label>
                </div>
                {isAdmin && (
                    <div className="form-group">
                        <label>Admin Code</label>
                        <input
                            type="text"
                            className="form-control"
                            value={adminCode}
                            onChange={(e) => setAdminCode(e.target.value)}
                            required={isAdmin}
                        />
                    </div>
                )}
                <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;