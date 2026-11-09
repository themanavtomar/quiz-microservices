import { Link } from "react-router-dom";
import {
  Code2,
  Database,
  Cloud,
  Braces,
  Server,
  Terminal,
  Cpu,
  Layers,
} from "lucide-react";

const categories = [
  { name: "Java", icon: Code2, color: "primary" },
  { name: "Python", icon: Terminal, color: "success" },
  { name: "JavaScript", icon: Braces, color: "warning" },
  { name: "Golang", icon: Cpu, color: "info" },
  { name: "SQL and DBMS", icon: Database, color: "danger" },
  { name: "MongoDB", icon: Database, color: "success" },
  { name: "AWS", icon: Cloud, color: "warning" },
  { name: "Spring Boot and Microservices", icon: Layers, color: "primary" },
];

function Home() {
  return (
    <div className="container py-5">
      <section className="hero-section text-center rounded-4 p-5 mb-5">
        <span className="badge bg-primary-subtle text-primary mb-3">
          Test Your Knowledge
        </span>

        <h1 className="display-5 fw-bold">
          Learn. Practice. <span className="text-primary">Succeed.</span>
        </h1>

        <p className="text-muted mx-auto mt-3" style={{ maxWidth: "600px" }}>
          Challenge yourself with technical quizzes covering programming,
          databases, cloud computing and backend development.
        </p>

        <Link to="/create" className="btn btn-primary btn-lg mt-3">
          Create Your Quiz
        </Link>
      </section>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Explore Categories</h2>
          <p className="text-muted mb-0">
            Choose a subject and test your skills.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <div className="col-12 col-sm-6 col-lg-3" key={category.name}>
              <Link
                to="/create"
                state={{ category: category.name }}
                className="text-decoration-none text-dark"
              >
                <div className="card category-card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div
                      className={`category-icon text-${category.color} bg-${category.color}-subtle`}
                    >
                      <Icon size={30} />
                    </div>

                    <h5 className="fw-bold mt-3">{category.name}</h5>

                    <span className="text-primary small">
                      Start practicing →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
