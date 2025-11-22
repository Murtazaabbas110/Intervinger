import { Link } from "react-router";
import Navbar from "../components/Navbar";

import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemsPage() {
  const problems = Object.values(PROBLEMS);

  const easyProblemsCount = problems.filter(
    (p) => p.difficulty === "Easy"
  ).length;
  const mediumProblemsCount = problems.filter(
    (p) => p.difficulty === "Medium"
  ).length;
  const hardProblemsCount = problems.filter(
    (p) => p.difficulty === "Hard"
  ).length;

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {/* HEADER */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Practice Problems
          </h1>
          <p className="text-base-content/70 text-sm sm:text-base">
            Sharpen your coding skills with these curated problems
          </p>
        </div>

        {/* PROBLEMS LIST */}
        <div className="space-y-4">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="card bg-base-100 hover:scale-[1.01] transition-transform w-full"
            >
              <div className="card-body flex flex-col sm:flex-row justify-between gap-4">
                {/* LEFT SIDE */}
                <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Code2Icon className="size-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-1 flex-wrap">
                      <h2 className="text-lg sm:text-xl font-bold break-words">
                        {problem.title}
                      </h2>
                      <span
                        className={`badge mt-1 sm:mt-0 break-words ${getDifficultyBadgeClass(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-base-content/60 break-words">
                      {problem.category}
                    </p>
                    <p className="text-base-content/80 text-sm sm:text-base mt-2 sm:mt-3">
                      {problem.description.text}
                    </p>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-2 text-primary mt-2 sm:mt-0 self-start sm:self-center">
                  <span className="font-medium">Solve</span>
                  <ChevronRightIcon className="size-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* STATS FOOTER */}
        <div className="mt-12 card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="stats stats-vertical md:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Total Problems</div>
                <div className="stat-value text-primary">{problems.length}</div>
              </div>

              <div className="stat">
                <div className="stat-title">Easy</div>
                <div className="stat-value text-success">
                  {easyProblemsCount}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Medium</div>
                <div className="stat-value text-warning">
                  {mediumProblemsCount}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Hard</div>
                <div className="stat-value text-error">{hardProblemsCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;
