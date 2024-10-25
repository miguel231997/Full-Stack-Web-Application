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
                    // If the response is not JSON, set a generic error
                    const textError = await response.text();
                    setErrors({ general: textError });
                }
            }
        } catch (error) {
            console.error('Error creating task:', error);
            setErrors({ general: 'An unexpected error occurred' });
        }
    };

    return(
        <div>
            <h1> Create a task</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label> Title </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors && errors.title && <p style={{ color: 'red'}}>{errors.title} </p>}
                </div>
                <div>
                    <label> Description </label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors && errors.setDescription && <p style={{color : 'red'}}> {errors.title} </p>}
                </div>
                <div>
                    <label> Status </label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="Pending"> Pending </option>
                        <option value="In Progress"> In Progress</option>
                        <option value="Completed"> Completed </option>
                    </select>
                </div>
                <button type="submit"> Create Task </button>
            </form>
            {errors && errors.general && <p style={{ color: 'red' }}> {errors.general} </p>}
        </div>
    )

};


export default CreateTask;