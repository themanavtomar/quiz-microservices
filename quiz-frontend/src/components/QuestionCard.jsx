
function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
}) {
  const options = [
    { key: "option1", label: question.option1 },
    { key: "option2", label: question.option2 },
    { key: "option3", label: question.option3 },
    { key: "option4", label: question.option4 },
  ];

  return (
    <div className="card border-0 shadow-sm question-card">
      <div className="card-body p-4 p-md-5">
        <div className="d-flex justify-content-between mb-3">
          <span className="badge bg-primary">
            Question {questionNumber}
          </span>

          <span className="text-muted">
            {questionNumber} / {totalQuestions}
          </span>
        </div>

        <div className="progress mb-4" style={{ height: "7px" }}>
          <div
            className="progress-bar"
            style={{
              width: `${(questionNumber / totalQuestions) * 100}%`,
            }}
          />
        </div>

        <h4 className="fw-bold mb-4">
          {question.questionTitle}
        </h4>

        <div className="d-grid gap-3">
          {options.map((option, index) => (
            <button
              key={option.key}
              type="button"
              className={`btn text-start option-btn ${
                selectedAnswer === option.label
                  ? "btn-primary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => onAnswer(option.label)}
            >
              <strong className="me-3">
                {String.fromCharCode(65 + index)}.
              </strong>
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;
