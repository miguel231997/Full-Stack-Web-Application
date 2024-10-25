import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const CreateTask = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Pending');
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const task = { title, description, status };
        const token = localStorage.getItem('token');
    
        if (!token) {
            setErrors('You must be logged in to create a task');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8080/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(task)
            });
    
            if (response.ok) {
                navigate('/tasks'); // Redirect to tasks page on success
            } else {
                const contentType = response.headers.get("content-type");
    
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    if (errorData.message) {
                        setErrors({ general: errorData.message });
                    } else {
                        setErrors({ general: 'Failed to create task' });
                    }
                } else {
                    const textError = await response.text();
                    setErrors({ general: textError });
                }
            }
        } catch (error) {
            console.error('Error creating task:', error);
            setErrors({ general: 'An unexpected error occurred' });
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Create a Task</h1>
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
                    {errors && errors.title && <p className="text-danger">{errors.title}</p>}
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
                    {errors && errors.description && <p className="text-danger">{errors.description}</p>}
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

                <button type="submit" className="btn btn-primary w-100">Create Task</button>
            </form>

            {errors && errors.general && <p className="text-danger text-center mt-3">{errors.general}</p>}
        </div>
    );
};

export default CreateTask;