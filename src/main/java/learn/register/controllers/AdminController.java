package learn.register.controllers;

import learn.register.models.AppUser;
import learn.register.security.AppUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")

public class AdminController {

    private final AppUserService appUserService;

    public AdminController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    // GET endpoint to retrieve all users, restricted to admins only

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<AppUser>> getAllUsers() {
        List<AppUser> users = appUserService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    //DELETE endpoint
    @PreAuthorize(("hasRole('ROLE_ADMIN')"))
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        boolean success = appUserService.deleteUser(id);
        if(success) {
            return ResponseEntity.ok("User deleted Successfully");
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
}
