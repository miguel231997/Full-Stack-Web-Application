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
        <div>
          <h1>Tasks Page</h1>
          {error && <p style={{ color: "red" }}>{error}</p>} {/* Display any errors */}
          <button onClick={handleAddTask}>Add Task</button>
          {tasks.length > 0 ? (
            <ul>
              {tasks.map((task) => (
                <li key={task.taskId}>
                <Link to={`/tasks/${task.taskId}`}>{task.title}</Link> - {task.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>No Tasks found</p>
          )}
        </div>
      );
    };

export default Tasks;