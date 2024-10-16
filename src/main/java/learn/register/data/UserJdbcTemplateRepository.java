package learn.register.data;

import learn.register.models.AppUser;
import learn.register.data.mappers.UserMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Repository
public class UserJdbcTemplateRepository implements UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Long findUserIdByUsername(String username) {
        final String sql = "SELECT id FROM users WHERE username = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{username}, Long.class);
    }

    @Override
    @Transactional
    public AppUser findByUsername(String username) {
        List<String> roles = getRolesByUsername(username); // Fetch roles

        // Ensure roles is never null
        if (roles == null) {
            roles = new ArrayList<>();
        }

        final String sql = "SELECT id, username, password, email, enabled FROM users WHERE username = ?;";
        return jdbcTemplate.query(sql, new UserMapper(roles), username)
                .stream()
                .findFirst()
                .orElse(null);    }

    @Override
    public AppUser create(AppUser user) {

        //insert user into the user table
        final String sql = "INSERT INTO users (username, password, email, enabled) VALUES (?, ?, ?, ?)";
        GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();

        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getPassword());
            ps.setString(3, user.getEmail());
            ps.setBoolean(4, user.isEnabled());
            return ps;
        }, keyHolder);

        if(rowsAffected <= 0) {
            return null;
        }

        user.setAppUserId(keyHolder.getKey().longValue());
        updateRoles(user);
        return user;
    }

    @Override
    @Transactional
    public void update(AppUser user) {
        //update the user details in the database
        final String sql = "UPDATE users SET username = ?, enabled = ? WHERE id = ?";
        jdbcTemplate.update(sql, user.getUsername(), user.isEnabled(), user.getAppUserId());
        updateRoles(user);
    }

    @Override
    public void updateRoles(AppUser user) {
        // Delete all existing roles for the user
        jdbcTemplate.update("DELETE FROM user_roles WHERE user_id = ?", user.getAppUserId());

        // Convert authorities (roles) back to string format (e.g., "ROLE_USER")
        Collection<GrantedAuthority> authorities = user.getAuthorities();
        if (authorities == null || authorities.isEmpty()) {
            return;
        }

        List<String> roles = AppUser.convertAuthoritiesToRoles(authorities);

        // Insert new roles
        for (String role : roles) {
            String sql = "INSERT INTO user_roles (user_id, role_id) "
                    + "SELECT ?, id FROM roles WHERE role_name = ?;";
            jdbcTemplate.update(sql, user.getAppUserId(), role);
        }
    }

    @Override
    public List<String> getRolesByUsername(String username) {
        // Query roles associated with a user by username
        final String sql = "SELECT r.role_name FROM roles r "
                + "INNER JOIN user_roles ur ON r.id = ur.role_id "
                + "INNER JOIN users u ON ur.user_id = u.id "
                + "WHERE u.username = ?";

        return jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("role_name"), username);
    }

    @Override
    public List<AppUser> findAll() {
        final String sql = "SELECT id, username, password, email, enabled FROM users";
        return jdbcTemplate.query(sql, new UserMapper(null));
    }

    @Override
    public AppUser findById(Long AppUserId) {
        final String sql = "SELECT * FROM users WHERE id = ?";

        List<AppUser> users = jdbcTemplate.query(sql, new Object[]{AppUserId}, new UserMapper(null));

        return users.isEmpty() ? null : users.get(0);
    }

    @Override
    public int deleteById(Long AppUserId) {
        final String sql = "DELETE FROM users WHERE id = ?";
        return jdbcTemplate.update(sql, AppUserId);
    }
}
