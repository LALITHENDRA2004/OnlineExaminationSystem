package com.exam.service;

import com.exam.model.User;
import com.exam.model.exam.Result;
import java.util.List;

public interface ResultService {
    public Result saveResult(Result result);

    public List<Result> getResultsByUser(User user);

    public long getTotalQuestionCount();
}
