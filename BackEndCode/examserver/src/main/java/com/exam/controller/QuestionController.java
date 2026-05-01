package com.exam.controller;

import com.exam.model.exam.Question;
import com.exam.model.exam.Quiz;
import com.exam.service.QuestionService;
import com.exam.service.QuizService;
import com.exam.service.ResultService;
import com.exam.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/question")
public class QuestionController {
    @Autowired
    private QuestionService service;

    @Autowired
    private QuizService quizService;

    // add question
    @PostMapping("/")
    public ResponseEntity<Question> add(@RequestBody Question question) {
        return ResponseEntity.ok(this.service.addQuestion(question));
    }

    // update the question
    @PutMapping("/")
    public ResponseEntity<Question> update(@RequestBody Question question) {
        return ResponseEntity.ok(this.service.updateQuestion(question));
    }

    // get all question of any quid
    @GetMapping("/quiz/{qid}")
    public ResponseEntity<?> getQuestionsOfQuiz(@PathVariable("qid") Long qid) {
        // Quiz quiz = new Quiz();
        // quiz.setqId(qid);
        // Set<Question> questionsOfQuiz = this.service.getQuestionsOfQuiz(quiz);
        // return ResponseEntity.ok(questionsOfQuiz);

        Quiz quiz = this.quizService.getQuiz(qid);
        Set<Question> questions = quiz.getQuestions();
        List<Question> list = new ArrayList<>(questions);
        if (list.size() > quiz.getNumberOfQuestions()) {
            list = list.subList(0, quiz.getNumberOfQuestions());
        }
        list.forEach((q) -> {
            q.setAnswer(null);
        });
        Collections.shuffle(list);
        return ResponseEntity.ok(list);

    }

    @GetMapping("/quiz/all/{qid}")
    public ResponseEntity<?> getQuestionsOfQuizAdmin(@PathVariable("qid") Long qid) {
        Quiz quiz = new Quiz();
        quiz.setQId(qid);
        Set<Question> questionsOfQuiz = this.service.getQuestionsOfQuiz(quiz);
        return ResponseEntity.ok(questionsOfQuiz);

        // return ResponseEntity.ok(list);

    }

    // get single question
    @GetMapping("/{quesId}")
    public Question get(@PathVariable("quesId") Long quesId) {
        return this.service.getQuestion(quesId);
    }

    // delete question
    @DeleteMapping("/{quesId}")
    public void delete(@PathVariable("quesId") Long quesId) {
        this.service.deleteQuestion(quesId);
    }

    @Autowired
    private UserService userService;

    @Autowired
    private ResultService resultService;

    // get total question count
    @GetMapping("/count")
    public ResponseEntity<?> getQuestionCount() {
        return ResponseEntity.ok(this.resultService.getTotalQuestionCount());
    }

    // eval quiz
    @PostMapping("/eval-quiz")
    public ResponseEntity<?> evalQuiz(@RequestBody List<Question> questions, java.security.Principal principal) {
        System.out.println(questions);
        double marksGot = 0;
        int correctAnswers = 0;
        int attempted = 0;

        // Get the quiz from the first question to calculate marks
        Quiz quiz = null;
        if (!questions.isEmpty() && questions.get(0).getQuiz() != null) {
            Long quizId = questions.get(0).getQuiz().getQId();
            quiz = this.quizService.getQuiz(quizId);
        }

        if (quiz == null || quiz.getMaxMarks() == null) {
            return ResponseEntity.badRequest().body("Invalid quiz data");
        }

        double maxMarks = (double) quiz.getMaxMarks();
        double marksSingle = maxMarks / questions.size();

        for (Question q : questions) {
            // Fetch full question detail from DB
            Question question = this.service.getQuestion(q.getQuesId());

            // Populate q with details for review serialization
            q.setContent(question.getContent());
            q.setOption1(question.getOption1());
            q.setOption2(question.getOption2());
            q.setOption3(question.getOption3());
            q.setOption4(question.getOption4());
            q.setAnswer(question.getAnswer());
            q.setImage(question.getImage());

            if (question.getAnswer().equals(q.getGivenAnswer())) {
                correctAnswers++;
                marksGot += marksSingle;
            }

            if (q.getGivenAnswer() != null && !q.getGivenAnswer().trim().isEmpty()) {
                attempted++;
            }
        }

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("marksGot", marksGot);
        responseMap.put("correctAnswers", correctAnswers);
        responseMap.put("attempted", attempted);

        // Save Result
        try {
            com.exam.model.User user = this.userService.getUser(principal.getName());
            com.exam.model.exam.Result result = new com.exam.model.exam.Result();
            result.setMarksGot(marksGot);
            result.setCorrectAnswers(correctAnswers);
            result.setAttempted(attempted);
            result.setSubmitDate(new Date());
            result.setUser(user);
            result.setQuiz(quiz);

            // Serialize responses
            try {
                ObjectMapper mapper = new ObjectMapper();
                String responsesJson = mapper.writeValueAsString(questions);
                result.setResponses(responsesJson);
            } catch (Exception e) {
                System.err.println("Error serializing responses: " + e.getMessage());
            }

            com.exam.model.exam.Result savedResult = this.resultService.saveResult(result);
            responseMap.put("rId", savedResult.getRId());

        } catch (Exception e) {
            System.err.println("Error saving result: " + e.getMessage());
            e.printStackTrace();
        }

        return ResponseEntity.ok(responseMap);
    }

}