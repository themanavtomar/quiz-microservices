import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LoaderCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import api from "../services/api";
import QuestionCard from "../components/QuestionCard";

function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch quiz questions
  useEffect(() => {
    const controller = new AbortController();

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Fetching questions for Quiz ID:", id);

        const response = await api.get(`/quiz/get/${id}`, {
          signal: controller.signal,
        });

        console.log("Questions API response:", response.data);

        if (!Array.isArray(response.data)) {
          throw new Error("Backend did not return a valid question list.");
        }

        if (response.data.length === 0) {
          throw new Error("No questions found for this quiz.");
        }

        setQuestions(response.data);
      } catch (err) {
        if (err.code === "ERR_CANCELED" || err.name === "CanceledError") {
          return;
        }

        console.error("Fetch Questions Error:", err);
        console.error("Backend Error Response:", err.response?.data);

        const backendMessage =
          typeof err.response?.data === "string"
            ? err.response.data
            : err.response?.data?.message || err.response?.data?.error;

        setError(
          backendMessage || err.message || "Unable to load quiz questions.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchQuestions();

    return () => controller.abort();
  }, [id]);

  // Select answer
  const handleAnswer = (answer) => {
    const questionId = questions[currentIndex]?.id;

    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  };

  // Submit quiz
  const handleSubmit = async () => {
    const unanswered = questions.filter((question) => !answers[question.id]);

    if (unanswered.length > 0) {
      setError(`Please answer all questions. ${unanswered.length} unanswered.`);
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const responsePayload = questions.map((question) => ({
        id: question.id,
        response: answers[question.id],
      }));

      console.log("Submitting answers:", responsePayload);

      const response = await api.post(`/quiz/submit/${id}`, responsePayload);

      console.log("Quiz result:", response.data);

      navigate("/result", {
        state: {
          score: response.data,
          total: questions.length,
        },
      });
    } catch (err) {
      console.error("Submit Quiz Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to submit quiz. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="container text-center py-5">
        <LoaderCircle className="spin" size={40} />
        <h5 className="mt-3">Loading your questions...</h5>
      </div>
    );
  }

  // Error
  if (error && questions.length === 0) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <AlertCircle className="me-2" size={20} />
          <strong>Unable to load quiz</strong>
          <p className="mb-0 mt-2">{error}</p>
          <p className="small mb-0 mt-2">Quiz ID: {id}</p>
        </div>

        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="container py-5">No questions available.</div>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="container py-5" style={{ maxWidth: "850px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Your Quiz</h3>
          <small className="text-muted">Quiz ID: {id}</small>
        </div>

        <span className="badge bg-primary">
          Answered: {Object.keys(answers).length}/{questions.length}
        </span>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        selectedAnswer={answers[currentQuestion.id] || ""}
        onAnswer={handleAnswer}
      />

      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-outline-secondary"
          disabled={currentIndex === 0 || submitting}
          onClick={() => {
            setError("");
            setCurrentIndex((index) => index - 1);
          }}
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            className="btn btn-primary"
            onClick={() => {
              setError("");
              setCurrentIndex((index) => index + 1);
            }}
          >
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>
    </div>
  );
}

export default TakeQuiz;
