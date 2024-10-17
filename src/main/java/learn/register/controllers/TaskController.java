package learn.register.controllers;

import learn.register.domain.Result;
import learn.register.domain.ResultType;
import learn.register.models.Task;
import learn.register.domain.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin()
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // GET all tasks for the authenticated user
    @GetMapping
    public Result<List<Task>> findAll() {
        return taskService.findAllTasks();
    }

    // GET Task by ID (only the task owner can access)
    @GetMapping("/{taskId}")
    public ResponseEntity<?> findById(@PathVariable Long taskId) {
        Result<Task> result = taskService.findTaskById(taskId);
        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
        }
        return new ResponseEntity<>(result.getMessage(), HttpStatus.NOT_FOUND);
    }

    // POST - Add a new task (only the authenticated user can add)
    @PostMapping
    public ResponseEntity<?> addTask(@RequestBody Task task) {
        Result<Task> result = taskService.addTask(task);
        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(result.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // PUT - Update an existing task (only task owner can update)
    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable Long taskId, @RequestBody Task task) {
        Result<Task> result = taskService.updateTask(taskId, task);

        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);  // Return updated task
        } else if (result.getType() == ResultType.NOT_FOUND) {
            return new ResponseEntity<>(result.getMessage(), HttpStatus.NOT_FOUND);  // Return 404 if task not found
        }

        return new ResponseEntity<>(result.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);  // Return 500 on any other error
    }

    // DELETE - Remove a task by its ID (only task owner can delete)
    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteById(@PathVariable Long taskId) {
        Result<Void> result = taskService.deleteTaskById(taskId);

        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // Return 204 on success with no content
        } else if (result.getType() == ResultType.NOT_FOUND) {
            return new ResponseEntity<>(result.getMessage(), HttpStatus.NOT_FOUND);  // Return 404 if task not found
        }

        return new ResponseEntity<>(result.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);  // Return 500 on any other error
    }

}
