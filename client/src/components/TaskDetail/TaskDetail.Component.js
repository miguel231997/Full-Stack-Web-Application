import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TaskDetail = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    setError('Failed to fetch task');
                    return;
                }

                const contentType = response.headers.get("content-type");

                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    setTask(data);  // Update to set the whole object
                } else {
                    setError('No task found or invalid response format.');
                }
            } catch (err) {
                setError('An error occurred while fetching the task.');
            }
        };

        fetchTask();
    }, [taskId]);

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                navigate('/tasks'); // Redirect back to tasks list after deletion
            } else {
                setError('Failed to delete task');
            }
        } catch (err) {
            setError('An error occurred while deleting the task.');
        }
    };

    const handleEdit = () => {
        navigate(`/tasks/edit/${taskId}`); // Redirect to edit page
    };

    if (error) return <p className="text-danger">{error}</p>;
    if (!task) return <p>Loading task...</p>;

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h1 className="card-title">{task.title}</h1>
                <p className="card-text"><strong>Status:</strong> {task.status}</p>
                <p className="card-text"><strong>Description:</strong> {task.description}</p>
                <div className="d-flex justify-content-between">
                    <button className="btn btn-warning" onClick={handleEdit}>Edit</button>
                    <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;