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

    if (error) return <p className="text-danger">{error}</p>;
    if (!task) return <p>Loading task details...</p>;

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Edit Task</h1>
            <form onSubmit={handleSubmit} className="w-50 mx-auto">
                <div className="form-group mb-3">
                    <label htmlFor="taskTitle">Title</label>
                    <input
                        type="text"
                        id="taskTitle"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="taskDescription">Description</label>
                    <textarea
                        id="taskDescription"
                        className="form-control"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="taskStatus">Status</label>
                    <select
                        id="taskStatus"
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary w-100">Update Task</button>
            </form>

            {error && <p className="text-danger text-center mt-3">{error}</p>}
        </div>
    );
};

export default EditTask;