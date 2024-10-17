package learn.register.data;

import learn.register.models.Task;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;
import learn.register.data.mappers.TaskMapper;

import java.sql.PreparedStatement;
import java.sql.Statement;
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

        List<Task> tasks = jdbcTemplate.query(sql, new TaskMapper(), taskId, userId);

        if (tasks.isEmpty()) {
            return null;  // Return null if no task is found
        }

        return tasks.get(0);  // Return the first task (should only be one due to primary key constraint)
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
        GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();

        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, task.getTitle());
            ps.setString(2, task.getDescription());
            ps.setString(3, task.getStatus());
            ps.setLong(4, task.getUserId());
            return ps;
        }, keyHolder);

        // Set the generated taskId to the task object
        if (rowsAffected > 0) {
            task.setTaskId(keyHolder.getKey().longValue());
        }

        return rowsAffected;
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
