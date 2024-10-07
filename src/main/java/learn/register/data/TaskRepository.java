package learn.register.data;

import learn.register.models.Task;
import java.util.List;

public interface TaskRepository {

    List<Task> findAllTasksByUserId(Long userId);

    Task findById(Long taskId);

    int createTask(Task task);

    int updateTask(Task task);

    int deleteTask(Long taskId);

}
