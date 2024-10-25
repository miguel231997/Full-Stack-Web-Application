import React, { useState, useEffect } from 'react';

const UserAdmin = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
                console.log("Fetched users:", data); // Log the users and roles data
            } else {
                const errorMessage = await response.text();
                setError(errorMessage || 'Failed to fetch users');
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/admin/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setUsers(users.filter(user => user.appUserId !== userId));
            } else {
                alert('Failed to delete user');
            }
        }
    };

    if (error) return <div className="alert alert-danger">{error}</div>;

    if (users.length === 0) return <p>No users found</p>;

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Manage Users</h1>
            <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.appUserId}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                {/* Conditionally render delete button if the user does not have ROLE_ADMIN */}
                                {user.roles && !user.roles.includes('ADMIN') && (
                                    <button 
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(user.appUserId)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserAdmin;