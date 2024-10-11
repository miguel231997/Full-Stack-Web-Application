package learn.register.domain;

import learn.register.models.Task;
import learn.register.data.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Fetch all tasks for the authenticated user
    public Result<List<Task>> findAllTasks() {
        Long userId = getAuthenticatedUserId();  // Get current user's ID
        Result<List<Task>> result = new Result<>();
        List<Task> tasks = taskRepository.findAllTasksByUserId(userId);

        if (tasks.isEmpty()) {
            result.setType(ResultType.NOT_FOUND);
            result.setMessage("No tasks found.");
        } else {
            result.setType(ResultType.SUCCESS);
            result.setPayload(tasks);
        }
        return result;
    }

    // Fetch a task by ID and ensure it belongs to the authenticated user
    public Result<Task> findTaskById(Long taskId) {
        Long userId = getAuthenticatedUserId();  // Get current user's ID
        Task task = taskRepository.findByIdAndUserId(taskId, userId);  // Ensure task belongs to user

        Result<Task> result = new Result<>();
        if (task == null) {
            result.setType(ResultType.NOT_FOUND);
            result.setMessage("Task not found.");
        } else {
            result.setType(ResultType.SUCCESS);
            result.setPayload(task);
        }
        return result;
    }

    // Add a new Task (assigns to authenticated user)
    public Result<Task> addTask(Task task) {
        Result<Task> result = validate(task);
        if (!result.isSuccess()) {
            return result;
        }

        task.setUserId(getAuthenticatedUserId());  // Set the task's owner to the authenticated user

        int saveResult = taskRepository.save(task);

        if (saveResult > 0) {
            result.setType(ResultType.SUCCESS);
            result.setPayload(task);
        } else {
            result.setType(ResultType.ERROR);
            result.setMessage("Could not save the task.");
        }
        return result;
    }

    // Update an existing task (only if it belongs to the authenticated user)
    public Result<Task> updateTask(Long taskId, Task task) {
        Long userId = getAuthenticatedUserId();  // Get current user's ID

        Task existingTask = taskRepository.findByIdAndUserId(taskId, userId);  // Ensure task belongs to user
        Result<Task> result = validate(task);
        if (existingTask == null) {
            result.setType(ResultType.NOT_FOUND);
            result.setMessage("Task not found.");
        } else {
            task.setTaskId(taskId);  // Set the correct task ID
            int updateResult = taskRepository.update(task);

            if (updateResult > 0) {
                result.setType(ResultType.SUCCESS);
            } else {
                result.setType(ResultType.ERROR);
                result.setMessage("Task could not be updated.");
            }
        }

        return result;
    }

    // Delete a task (only if it belongs to the authenticated user)
    public Result<Void> deleteTaskById(Long taskId) {
        Long userId = getAuthenticatedUserId();  // Get current user's ID
        Task task = taskRepository.findByIdAndUserId(taskId, userId);  // Ensure task belongs to user

        Result<Void> result = new Result<>();
        if (task == null) {
            result.setType(ResultType.NOT_FOUND);
            result.setMessage("Task not found.");
        } else {
            int deleteResult = taskRepository.deleteById(taskId);

            if (deleteResult > 0) {
                result.setType(ResultType.SUCCESS);
            } else {
                result.setType(ResultType.ERROR);
                result.setMessage("Task could not be deleted.");
            }
        }

        return result;
    }

    // Get the ID of the authenticated user
    private Long getAuthenticatedUserId() {
        User authenticatedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return Long.valueOf(authenticatedUser.getUsername());  // Assuming the username is the user's ID
    }

    // Validation method for task inputs
    private Result<Task> validate(Task task) {
        Result<Task> result = new Result<>();

        if (task.getTitle() == null || task.getTitle().trim().isEmpty()) {
            result.setType(ResultType.INVALID);
            result.setMessage("Task title is required.");
            return result;
        }

        if (task.getDescription() == null || task.getDescription().trim().isEmpty()) {
            result.setType(ResultType.INVALID);
            result.setMessage("Task description is required.");
            return result;
        }

        if (task.getStatus() == null || task.getStatus().trim().isEmpty()) {
            result.setType(ResultType.INVALID);
            result.setMessage("Status must be set.");
            return result;
        }

        result.setType(ResultType.SUCCESS);
        return result;
    }
}