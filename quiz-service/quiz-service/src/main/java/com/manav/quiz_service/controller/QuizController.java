
package com.manav.quiz_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.manav.quiz_service.model.QuestionWrapper;
import com.manav.quiz_service.model.QuizDto;
import com.manav.quiz_service.model.Response;
import com.manav.quiz_service.service.QuizService;

import java.util.List;

@RestController
@RequestMapping("quiz")
public class QuizController {

    final QuizService quizService;

    QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping("create")
    public ResponseEntity<Integer> createQuiz(
            @RequestBody QuizDto quizDto) {

        return quizService.createQuiz(
                quizDto.getCategoryName(),
                quizDto.getNumQuestions(),
                quizDto.getTitle()
        );
    }

    @GetMapping("get/{id}")
    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(
            @PathVariable Integer id) {

        return quizService.getQuizQuestions(id);
    }

    @PostMapping("submit/{id}")
    public ResponseEntity<Integer> submitQuiz(
            @PathVariable Integer id,
            @RequestBody List<Response> responses) {

        return quizService.calculateResult(id, responses);
    }
}
