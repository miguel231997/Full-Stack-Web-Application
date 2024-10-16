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
    public Task findByIdAndUserId(Long taskId, Long userId) {
        final String sql = "SELECT * FROM tasks WHERE id = ? AND user_id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{taskId, userId}, new TaskMapper());
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
    public int save(Task task) {
        final String sql = "INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getUserId());
    }

    @Override
    public int update(Task task) {
        final String sql = "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?";
        return jdbcTemplate.update(sql,
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getTaskId());
    }

    @Override
    public int deleteById(Long taskId) {
        final String sql = "DELETE FROM tasks WHERE id = ?";
        return jdbcTemplate.update(sql, taskId);
    }
}
