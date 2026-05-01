package com.exam.model.exam;

import com.exam.model.User;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "results")
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long rId;

    private double marksGot;
    private int correctAnswers;
    private int attempted;

    private Date submitDate;

    @Lob
    private String responses;

    @ManyToOne(fetch = FetchType.EAGER)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    private Quiz quiz;

    public Result(double marksGot, int correctAnswers, int attempted, Date submitDate, User user, Quiz quiz) {
        this.marksGot = marksGot;
        this.correctAnswers = correctAnswers;
        this.attempted = attempted;
        this.submitDate = submitDate;
        this.user = user;
        this.quiz = quiz;
    }
}
