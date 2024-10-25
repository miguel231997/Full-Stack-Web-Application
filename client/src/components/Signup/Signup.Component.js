import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = ({ setIsLoggedIn, setIsAdmin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setSignupAdmin] = useState(false);
    const [adminCode, setAdminCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const credentials = { username, password, email };

        if (isAdmin) {
            credentials.code = adminCode;
        }

        try {
            const response = await fetch('http://localhost:8080/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.jwt_token);

                setIsLoggedIn(true);
                const decodedToken = JSON.parse(atob(data.jwt_token.split('.')[1]));
                const roles = decodedToken.authorities || [];
                setIsAdmin(roles.includes('ROLE_ADMIN'));

                navigate('/tasks');
            } else {
                const errorText = await response.text();
                setErrorMessage(errorText);
            }
        } catch (error) {
            console.error('Signup failed:', error);
            setErrorMessage('An unexpected error occurred.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4 shadow-sm">
                        <h2 className="card-title text-center">Sign Up</h2>
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="Enter your username"
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter your password"
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="form-check mt-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="isAdmin"
                                    checked={isAdmin}
                                    onChange={() => setSignupAdmin(!isAdmin)}
                                />
                                <label className="form-check-label" htmlFor="isAdmin">Register as Admin</label>
                            </div>
                            {isAdmin && (
                                <div className="form-group mt-3">
                                    <label htmlFor="adminCode">Admin Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="adminCode"
                                        value={adminCode}
                                        onChange={(e) => setAdminCode(e.target.value)}
                                        placeholder="Enter the admin code"
                                        required={isAdmin}
                                    />
                                </div>
                            )}
                            <button type="submit" className="btn btn-primary w-100 mt-4">Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;