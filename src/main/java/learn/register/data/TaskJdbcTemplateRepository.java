package learn.register.data;

import learn.register.models.Task;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import learn.register.data.mappers.TaskMapper;

import java.util.List;

@Repository
public class TaskJdbcTemplateRepository implements TaskRepository {

    private final JdbcTemplate jdbcTemplate;

    public TaskJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Task> findAllTasksByUserId(Long userId) {
        final String sql = "SELECT * FROM tasks WHERE user_id = ?";
        return jdbcTemplate.query(sql, new Object[]{userId}, new TaskMapper());
    }

    @Override
    public Task findById(Long taskId) {
        final String sql = "SELECT * FROM tasks WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{taskId}, new TaskMapper());
    }

    @Override
    public int createTask(Task task) {
        final String sql = "INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getId());
    }

    @Override
    public int updateTask(Task task) {
        final String sql = "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?";
        return jdbcTemplate.update(sql,
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getId());
    }

    @Override
    public int deleteTask(Long taskId) {
        final String sql = "DELETE FROM tasks WHERE id = ?";
        return jdbcTemplate.update(sql, taskId);
    }
}
