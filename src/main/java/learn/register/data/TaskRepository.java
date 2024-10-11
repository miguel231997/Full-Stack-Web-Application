package learn.register.data;

import learn.register.models.Task;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository {

    List<Task> findAllTasksByUserId(Long userId);

    Task findById(Long taskId);

    Task findByIdAndUserId(Long taskId, Long userId);  // New method to find tasks by ID and user ID

    int save(Task task);

    int update(Task task);

    int deleteById(Long taskId);
}