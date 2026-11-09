package com.manav.quiz_service.dao;


import org.springframework.data.jpa.repository.JpaRepository;

import com.manav.quiz_service.model.Quiz;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.Optional;

public interface QuizDao extends JpaRepository<Quiz,Integer> {
	@EntityGraph(attributePaths = "questionIds")
	Optional<Quiz> findWithQuestionIdsById(Integer id);
}


