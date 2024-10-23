import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const TaskDetail = () => {
    const { taskId } = useParams();
    const [ task, setTask ] = useState(null);
    const [error, setError ] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async() => {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
                headers: {
                    'Authorization' : `Bearer ${token}`,
                },
            });

            if(response.ok) {
                const data = await response.json();
                setTask(data.payload);
            } else {
                setError('Failed to fetch task');
            }
        };
        fetchTask()
    }, [taskId])

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
            method: 'Delete',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if(response.ok) {
            navigate('/tasks');
        } else {
            setError('Failed to delete task!')
        }
    };

    const handleEdit = () => {
        navigate(`/tasks/edit/${taskId}`);
    };

    if(error) return <p>{error}</p>
    if(!task) return <p> Loading Task......</p>

    return (
        <div>
            <h1> {task.title} </h1>
            <p> Status: {task.status}</p>
            <p> Description: {task.description} </p>
            <button onClick={handleEdit}> Edit </button>
            <button onClick={handleDelete} > Delete </button>
        </div>
    )
}