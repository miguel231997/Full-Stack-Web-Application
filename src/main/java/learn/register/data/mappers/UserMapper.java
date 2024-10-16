package learn.register.data.mappers;

import learn.register.models.AppUser;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class UserMapper implements RowMapper<AppUser> {

    private final List<String> roles;

    public UserMapper(List<String> roles) {
        this.roles = roles;
    }

    @Override
    public AppUser mapRow(ResultSet rs, int rowNum) throws SQLException {
        List<String> roles = this.roles != null ? this.roles : new ArrayList<>(); // Handle null roles
        return new AppUser(
                rs.getLong("id"),
                rs.getString("username"),
                rs.getString("password"),
                rs.getString("email"),
                rs.getBoolean("enabled"),
                roles
        );
    }
}
