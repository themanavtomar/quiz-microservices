
package com.manav.quiz_service.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.manav.quiz_service.dao.QuizDao;
import com.manav.quiz_service.feign.QuizInterface;
import com.manav.quiz_service.model.QuestionWrapper;
import com.manav.quiz_service.model.Quiz;
import com.manav.quiz_service.model.Response;

import java.util.List;

@Service
public class QuizService {

	final QuizDao quizDao;
	final QuizInterface quizInterface;

	QuizService(QuizDao quizDao, QuizInterface quizInterface) {
		this.quizDao = quizDao;
		this.quizInterface = quizInterface;
	}

	public ResponseEntity<Integer> createQuiz(String category, int numQ, String title) {

		List<Integer> questions = quizInterface.getQuestionsForQuiz(category, numQ).getBody();

		if (questions == null || questions.isEmpty()) {
			return ResponseEntity.badRequest().build();
		}

		Quiz quiz = new Quiz();
		quiz.setTitle(title);
		quiz.setQuestionIds(questions);

		Quiz savedQuiz = quizDao.save(quiz);

		return new ResponseEntity<>(savedQuiz.getId(), HttpStatus.CREATED);
	}

	public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(Integer id) {

		// Find quiz from database
		Quiz quiz = quizDao.findById(id).orElseThrow(() -> new RuntimeException("Quiz not found: " + id));

		// Get question IDs
		List<Integer> questionIds = quiz.getQuestionIds();

		// Call Question Service using Feign
		ResponseEntity<List<QuestionWrapper>> feignResponse = quizInterface.getQuestionsFromId(questionIds);

		// Extract only the response body
		List<QuestionWrapper> questions = feignResponse.getBody();

		if (questions == null) {
			return ResponseEntity.internalServerError().build();
		}

		// Create a fresh HTTP response instead of forwarding Feign headers
		return ResponseEntity.ok(questions);
	}

	public ResponseEntity<Integer> calculateResult(Integer id, List<Response> responses) {

		ResponseEntity<Integer> scoreResponse = quizInterface.getScore(responses);

		Integer score = scoreResponse.getBody();

		if (score == null) {
			return ResponseEntity.internalServerError().build();
		}

		return ResponseEntity.ok(score);
	}
}
