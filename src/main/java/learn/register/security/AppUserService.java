package learn.register.security;

import learn.register.data.UserRepository;
import learn.register.models.AppUser;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.validation.ValidationException;
import java.util.List;

@Service
public class AppUserService implements UserDetailsService {
    private final UserRepository repository;
    private final PasswordEncoder encoder;

    public AppUserService(UserRepository repository,
                          PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    public List<AppUser> getAllUsers() {
        return repository.findAll();
    }

    public boolean deleteUser(Long id) {
        AppUser user = repository.findById(id);
        if(user != null) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = repository.findByUsername(username);

        if (user == null || !user.isEnabled()) {
            throw new UsernameNotFoundException(username + " not found");
        }

        return user;
    }


    public AppUser create(String username, String password, String role) {
        validateUsername(username);
        validatePassword(password);

        System.out.println(role);
        if (repository.findByUsername(username) != null) {
            throw new ValidationException("User already exists");
        }

        String encodedPassword = encoder.encode(password);

        // Prefix role with "ROLE_"
        String prefixedRole = "ROLE_" + role.toUpperCase();

        // Creating a user with the provided role (e.g., ROLE_PROFESSOR, ROLE_STUDENT)
        AppUser newUser = new AppUser(0L, username, encodedPassword, true, List.of(prefixedRole));

        // Saving the user to the repository
        return repository.create(newUser);
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 8) {
            throw new ValidationException("password must be at least 8 characters");
        }

        int digits = 0;
        int letters = 0;
        int others = 0;
        for (char c : password.toCharArray()) {
            if (Character.isDigit(c)) {
                digits++;
            } else if (Character.isLetter(c)) {
                letters++;
            } else {
                others++;
            }
        }

        if (digits == 0 || letters == 0 || others == 0) {
            throw new ValidationException("password must contain a digit, a letter, and a non-digit/non-letter");
        }
    }

    private void validateUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new ValidationException("Username is required.");
        }

        if (username.length() < 3 || username.length() > 50) {
            throw new ValidationException("Username must be between 3 and 50 characters.");
        }

        if (!username.matches("^[a-zA-Z0-9._-]+$")) {
            throw new ValidationException("Username can only contain letters, digits, dots, underscores, and hyphens.");
        }
    }
}
