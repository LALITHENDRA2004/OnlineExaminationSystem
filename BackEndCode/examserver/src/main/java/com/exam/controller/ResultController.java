package com.exam.controller;

import com.exam.model.User;
import com.exam.model.exam.Result;
import com.exam.service.ResultService;
import com.exam.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/result")
public class ResultController {

    private final ResultService resultService;
    private final UserService userService;

    public ResultController(ResultService resultService, UserService userService) {
        this.resultService = resultService;
        this.userService = userService;
    }

    @GetMapping("/current-user")
    public ResponseEntity<?> getResultsByName(Principal principal) {
        User user = this.userService.getUser(principal.getName());
        List<Result> results = this.resultService.getResultsByUser(user);
        return ResponseEntity.ok(results);
    }
}
