package com.exam.repo;

import com.exam.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    public User findByUsername(String username);

    public User findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.username = :input OR u.email = :input")
    public User findByUsernameOrEmail(@Param("input") String input);
}

