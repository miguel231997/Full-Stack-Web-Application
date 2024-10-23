import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditTask = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch the task details for the given taskId
    useEffect(() => {
        const fetchTask = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });


                if (response.ok) {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const data = await response.json();
                        // Directly access the task object since there's no payload wrapper
                        setTask(data);
                        setTitle(data.title);
                        setDescription(data.description);
                        setStatus(data.status);
                    } else {
                        setError('Invalid response format.');
                    }
                } else {
                    setError('Failed to fetch task');
                }
            } catch (error) {
                setError('An error occurred while fetching the task.');
            }
        };

        fetchTask();
    }, [taskId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const updatedTask = { title, description, status };

        try {
            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedTask),
            });

            if (response.ok) {
                navigate('/tasks');
            } else {
                setError('Failed to update task');
            }
        } catch (error) {
            setError('An error occurred while updating the task.');
        }
    };

    if (error) return <p>{error}</p>;
    if (!task) return <p>Loading task details...</p>;

    return (
        <div>
            <h1>Edit Task</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Status</label>
                    <input
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Update Task</button>
            </form>
        </div>
    );
};

export default EditTask;