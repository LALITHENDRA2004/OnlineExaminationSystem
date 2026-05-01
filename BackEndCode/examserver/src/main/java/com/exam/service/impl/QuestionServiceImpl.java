package com.exam.service.impl;

import com.exam.model.exam.Question;
import com.exam.model.exam.Quiz;
import com.exam.repo.QuizRepository;
import com.exam.repo.QuestionRepository;
import com.exam.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizRepository quizRepository;


    @Override
    public Question addQuestion(Question question) {
        if (question.getQuiz() == null || question.getQuiz().getQId() == null) {
            throw new RuntimeException("Quiz is required");
        }

        Quiz quiz = quizRepository.findById(
            question.getQuiz().getQId()
        ).orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (
                question.getContent() == null || question.getContent().trim().isEmpty() ||
                question.getOption1() == null || question.getOption1().trim().isEmpty() ||
                question.getOption2() == null || question.getOption2().trim().isEmpty() ||
                question.getOption3() == null || question.getOption3().trim().isEmpty() ||
                question.getOption4() == null || question.getOption4().trim().isEmpty() ||
                question.getAnswer() == null || question.getAnswer().trim().isEmpty()
        ) {
            throw new RuntimeException("All question fields are required");
        }

        // Validate that answer matches one of the options (case-insensitive and trimmed)
        String answer = question.getAnswer().trim();
        if (!answer.equalsIgnoreCase(question.getOption1().trim()) &&
            !answer.equalsIgnoreCase(question.getOption2().trim()) &&
            !answer.equalsIgnoreCase(question.getOption3().trim()) &&
            !answer.equalsIgnoreCase(question.getOption4().trim())) {
            throw new RuntimeException("Answer must match one of the options exactly");
        }

        question.setQuiz(quiz);
        return questionRepository.save(question);
    }

    @Override
    public Question updateQuestion(Question question) {
        return this.questionRepository.save(question);
    }

    @Override
    public Set<Question> getQuestions() {
        return new HashSet<>(this.questionRepository.findAll());
    }

    @Override
    public Question getQuestion(Long questionId) {
        return this.questionRepository.findById(questionId)
        .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    @Override
    public Set<Question> getQuestionsOfQuiz(Quiz quiz) {
        return this.questionRepository.findByQuiz(quiz);
    }

    @Override
    public void deleteQuestion(Long quesId) {
        Question question = this.questionRepository.findById(quesId)
        .orElseThrow(() -> new RuntimeException("Question not found"));
        this.questionRepository.delete(question);
    }

    // @Override
    // public Question get(Long questionsId) {
    //    return this.questionRepository.getOne(questionsId);
    // }
}
