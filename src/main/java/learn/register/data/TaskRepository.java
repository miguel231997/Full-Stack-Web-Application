package learn.register.data;

import learn.register.models.Task;
import java.util.List;

public interface TaskRepository {

    List<Task> findAllTasksByUserId(Long userId);

    Task findById(Long taskId);

    int save(Task task);

    int update(Task task);

    int deleteById(Long taskId);

}
