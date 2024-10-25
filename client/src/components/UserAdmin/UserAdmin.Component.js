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

    if (error) return <p>{error}</p>;

    if (users.length === 0) return <p>No users found</p>;

    return (
        <div>
            <h1>Manage Users</h1>
            <ul>
    {users.map(user => {
        console.log("User:", user.username, "Roles:", user.roles); // Log user and roles here

        return (
            <li key={user.appUserId}>
                {user.username} - {user.email} - {user.taskCount} tasks
                {/* Conditionally render delete button if the user does not have ROLE_ADMIN */}
                {user.roles && !user.roles.includes('ADMIN') && (
                    <button onClick={() => handleDelete(user.appUserId)}>Delete</button>
                )}
            </li>
        );
    })}
</ul>
        </div>
    );
};

export default UserAdmin;