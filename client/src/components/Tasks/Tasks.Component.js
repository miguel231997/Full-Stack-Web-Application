import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem("token"); // Get token from local storage
            try {
                const response = await fetch("http://localhost:8080/api/tasks", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the Bearer token
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setTasks(data.payload || []); // Handle case where payload might be null
                } else {
                    setError("Failed to fetch tasks");
                }
            } catch (err) {
                setError("An error occurred while fetching tasks");
            }
        };

        fetchTasks();
    }, []);

    const handleAddTask = () => {
        navigate('/create-task')
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center">
                <h1>Tasks</h1>
                <button className="btn btn-primary" onClick={handleAddTask}>Add Task</button>
            </div>
            {error && <div className="alert alert-danger mt-3">{error}</div>} {/* Display any errors */}
            {tasks.length > 0 ? (
                <ul className="list-group mt-3">
                    {tasks.map((task) => (
                        <li key={task.taskId} className="list-group-item d-flex justify-content-between align-items-center">
                            <Link to={`/tasks/${task.taskId}`} className="text-decoration-none">{task.title}</Link>
                            <span className={`badge ${task.status === 'Completed' ? 'bg-success' : 'bg-warning'} rounded-pill`}>
                                {task.status}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-3">No Tasks found</p>
            )}
        </div>
    );
};

export default Tasks;