package com.exam.service.impl;

import com.exam.model.User;
import com.exam.model.exam.Result;
import com.exam.repo.QuestionRepository;
import com.exam.repo.ResultRepository;
import com.exam.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultServiceImpl implements ResultService {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public Result saveResult(Result result) {
        return this.resultRepository.save(result);
    }

    @Override
    public List<Result> getResultsByUser(User user) {
        return this.resultRepository.findByUser(user);
    }

    @Override
    public long getTotalQuestionCount() {
        return this.questionRepository.count();
    }
}
