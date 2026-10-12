package com.exam;

import com.exam.exception.UserFoundException;
import com.exam.model.Role;
import com.exam.model.User;
import com.exam.model.UserRole;
import com.exam.repo.QuizRepository;
import com.exam.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class ExamserverApplication implements CommandLineRunner {

    private final UserService userService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    public final QuizRepository quizRepository;

    public ExamserverApplication(UserService userService, BCryptPasswordEncoder bCryptPasswordEncoder, QuizRepository quizRepository) {
        this.userService = userService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.quizRepository = quizRepository;
    }

    public static void main(String[] args) {

        SpringApplication.run(ExamserverApplication.class, args);

    }

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("starting code");

            String username = "lalithendra2810";
            User existingUser = this.userService.getUser(username);
            if (existingUser != null) {
                System.out.println("User found, deleting to update password...");
                this.userService.deleteUser(existingUser.getId());
            }

            User user = new User();
            user.setFirstName("Lalitendra");
            user.setLastName("Nichenakolla");
            user.setUsername(username);
            user.setPassword(this.bCryptPasswordEncoder.encode("12345"));
            user.setEmail("lalithendran10@gmail.com");
            user.setProfile("default.png");

            Role role1 = new Role();
            role1.setRoleId(44L);
            role1.setRoleName("ADMIN");

            Set<UserRole> userRoleSet = new HashSet<>();
            UserRole userRole = new UserRole();

            userRole.setRole(role1);

            userRole.setUser(user);

            userRoleSet.add(userRole);

            User user1 = this.userService.createUser(user, userRoleSet);
            System.out.println(user1.getUsername());

            // Seed default Student user if not exists
            String studentUsername = "student";
            User existingStudent = this.userService.getUser(studentUsername);
            if (existingStudent == null) {
                User student = new User();
                student.setFirstName("Student");
                student.setLastName("User");
                student.setUsername(studentUsername);
                student.setPassword(this.bCryptPasswordEncoder.encode("12345"));
                student.setEmail("student@gmail.com");
                student.setEnabled(true);
                student.setProfile("default.png");

                Role role2 = new Role();
                role2.setRoleId(45L);
                role2.setRoleName("NORMAL");

                Set<UserRole> studentRoleSet = new HashSet<>();
                UserRole studentUserRole = new UserRole();
                studentUserRole.setRole(role2);
                studentUserRole.setUser(student);
                studentRoleSet.add(studentUserRole);

                User createdStudent = this.userService.createUser(student, studentRoleSet);
                System.out.println("Created student user: " + createdStudent.getUsername());
            }

        } catch (UserFoundException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}