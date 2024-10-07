package learn.register.controllers;

import learn.register.domain.Result;
import learn.register.models.Task;
import learn.register.domain.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // GET all Tasks for a user
    @GetMapping
    public Result<List<Task>> findAll(@PathVariable Long userId) {
        return taskService.findAllTasks(userId);
    }

    // GET Task by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long taskId) {
        Result<Task> result = taskService.findTaskById(taskId);
        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
        }
        return new ResponseEntity<>(result.getMessage(), HttpStatus.NOT_FOUND);
    }


    // POST - Add a new task
    @PostMapping
    public ResponseEntity<?> addTask(@RequestBody Task task) {
        Result<Task> result = taskService.addTask(task);
        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(result.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }


    // PUT - Update an existing task
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long taskId, @RequestBody Task task) {
        Result<Task> result = taskService.updateTask(taskId, task);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(result.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }


    // DELETE - Remove a task by its id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long taskId) {
        Result<Void> result = taskService.deleteTaskById(taskId);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(result.getMessage(), HttpStatus.NOT_FOUND);
    }

}
