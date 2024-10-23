import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditTask = () => {
    const { taskId } = useParams();
    const [ task, setTask ] = useState({title: '', description: '', status: ''});
    const [ error, setError ] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async() => {
            const token = localStorage.getItem('token');
            const reponse = await fetch(`http://localhost:8080/api/tasks/${taskId}`,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if(reponse.ok) {
                const data = await Response.json();
                setTask(data.payload);
            } else {
                setError('Failed to fetch task');
            }
        };

        fetchTask();
    }, [ taskId ]);

    const handleSubmit = async(e) => {
        e.preventDafault();

        const token = localStorage.getItem('token');

        const reponse = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-type' : 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(task),
        });

        if(Response.ok) {
            navigate('/tasks');
        } else {
            setError('Failed to update task')
        }
    };

    if(error) return <p>{error}</p>

    return(
        <div>
            <h1>Edit Task</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={task.title}
                        onChange={(e) => setTask({ ...task, title: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        value={task.description}
                        onChange={(e) => setTask({ ...task, description: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Status</label>
                    <select
                        value={task.status}
                        onChange={(e) => setTask({ ...task, status: e.target.value })}
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );

};