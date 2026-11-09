import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Play, LoaderCircle } from "lucide-react";
import api from "../services/api";

const categories = [
  "Java",
  "Python",
  "JavaScript",
  "Golang",
  "SQL and DBMS",
  "MongoDB",
  "AWS",
  "Spring Boot and Microservices",
];

function CreateQuiz() {
  const location = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [categoryName, setCategoryName] = useState(
    location.state?.category || "Java",
  );
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateQuiz = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a quiz title.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/quiz/create", {
        title: title.trim(),
        categoryName,
        numQuestions: Number(numQuestions),
      });

      // Debug backend response
      console.log("Full API Response:", response);
      console.log("Response Data:", response.data);
      console.log("Response Data Type:", typeof response.data);

      // Backend returns ResponseEntity<Integer>
      // Example: 1
      // Also supports: { id: 1 }
      const quizId =
        typeof response.data === "object" && response.data !== null
          ? response.data.id
          : response.data;

      if (quizId == null || quizId === "" || !Number.isFinite(Number(quizId))) {
        throw new Error(
          `Invalid Quiz ID returned by backend: ${JSON.stringify(response.data)}`,
        );
      }

      console.log("Created Quiz ID:", quizId);

      // Navigate to quiz page
      navigate(`/quiz/${quizId}`);
    } catch (err) {
      console.error("Create Quiz Error:", err);

      setError(
        err.response?.data?.message || err.message || "Unable to create quiz.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h2 className="fw-bold mb-2">Create Your Quiz</h2>

              <p className="text-muted mb-4">
                Customize your quiz and start testing your knowledge.
              </p>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleCreateQuiz}>
                {/* Quiz Title */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Quiz Title</label>

                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="e.g. Java Interview Test"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Category */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Select Category
                  </label>

                  <select
                    className="form-select form-select-lg"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of Questions */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Number of Questions
                  </label>

                  <select
                    className="form-select form-select-lg"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                  >
                    {[5, 10, 15].map((number) => (
                      <option key={number} value={number}>
                        {number} Questions
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="me-2 spin" size={18} />
                      Creating Quiz...
                    </>
                  ) : (
                    <>
                      <Play className="me-2" size={18} />
                      Start Quiz
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateQuiz;
