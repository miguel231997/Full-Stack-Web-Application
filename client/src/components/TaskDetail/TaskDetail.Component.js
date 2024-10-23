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
            console.log(`Fetching task with ID: ${taskId}`); // Debug: log taskId

            try {
                const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                console.log('Response status:', response.status); // Debug: log response status

                if (!response.ok) {
                    setError('Failed to fetch task');
                    return;
                }

                const contentType = response.headers.get("content-type");
                console.log('Content-Type:', contentType); // Debug: log content type

                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    console.log('Task data:', data); // Debug: log data received
                    setTask(data);  // Update to set the whole object
                } else {
                    setError('No task found or invalid response format.');
                }
            } catch (err) {
                setError('An error occurred while fetching the task.');
                console.error(err);
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
            console.error(err);
        }
    };

    const handleEdit = () => {
        navigate(`/tasks/edit/${taskId}`); // Redirect to edit page
    };

    if (error) return <p>{error}</p>;
    if (!task) return <p>Loading task...</p>;

    return (
        <div>
            <h1>{task.title}</h1>
            <p>Status: {task.status}</p>
            <p>Description: {task.description}</p>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
};

export default TaskDetail;