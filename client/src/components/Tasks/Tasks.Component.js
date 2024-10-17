import React, { useState, useEffect } from "react";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);

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
      return (
        <div>
          <h1>Tasks Page</h1>
          {error && <p style={{ color: "red" }}>{error}</p>} {/* Display any errors */}
          {tasks.length > 0 ? (
            <ul>
              {tasks.map((task) => (
                <li key={task.taskId}>
                  {task.title} - {task.status} {/* Correct status rendering */}
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