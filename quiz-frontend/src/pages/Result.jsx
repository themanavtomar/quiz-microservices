import { Link, useLocation } from "react-router-dom";
import { Trophy, RotateCcw, Home } from "lucide-react";

function Result() {
  const location = useLocation();

  const score = Number(location.state?.score);
  const total = Number(location.state?.total);

  if (
    location.state?.score == null ||
    !Number.isFinite(score) ||
    !Number.isFinite(total) ||
    total <= 0
  ) {
    return (
      <div className="container text-center py-5">
        <h3>No quiz result found.</h3>
        <Link to="/" className="btn btn-primary mt-3">
          Back Home
        </Link>
      </div>
    );
  }

  const percentage = Math.round((score / total) * 100);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body p-5">
              <Trophy size={65} className="text-warning mb-3" />

              <h2 className="fw-bold">Quiz Completed!</h2>

              <p className="text-muted">
                Great job! Here is your performance summary.
              </p>

              <div className="result-circle mx-auto my-4">
                <h1 className="fw-bold mb-0">{percentage}%</h1>
                <small>Score</small>
              </div>

              <h4 className="fw-bold">
                {score} / {total}
              </h4>

              <p className="text-muted">Correct Answers</p>

              <div className="progress mb-4" style={{ height: "12px" }}>
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <h5 className="mb-4">
                {percentage >= 80
                  ? "Excellent performance!"
                  : percentage >= 50
                    ? "Good effort! Keep practicing."
                    : "Keep learning. You can improve!"}
              </h5>

              <div className="d-grid gap-2">
                <Link to="/create" className="btn btn-primary">
                  <RotateCcw size={17} className="me-2" />
                  Try Another Quiz
                </Link>

                <Link to="/" className="btn btn-outline-secondary">
                  <Home size={17} className="me-2" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;
