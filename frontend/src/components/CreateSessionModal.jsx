import { Code2Icon, LoaderIcon, PlusIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-full sm:max-w-2xl p-4 sm:p-6">
        <h3 className="font-bold text-xl sm:text-2xl mb-6">
          Create New Session
        </h3>

        <div className="space-y-6 sm:space-y-8">
          {/* PROBLEM SELECTION */}
          <div className="space-y-2">
            <label className="label flex justify-between">
              <span className="label-text font-semibold text-sm sm:text-base">
                Select Problem
              </span>
              <span className="label-text-alt text-error text-sm">*</span>
            </label>

            <select
              className="select w-full sm:text-base text-sm"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find(
                  (p) => p.title === e.target.value
                );
                setRoomConfig({
                  difficulty: selectedProblem.difficulty,
                  problem: e.target.value,
                });
              }}
            >
              <option value="" disabled>
                Choose a coding problem...
              </option>
              {problems.map((problem) => (
                <option key={problem.id} value={problem.title}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="alert alert-success flex items-start gap-2 sm:gap-3 text-sm sm:text-base">
              <Code2Icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <div>
                <p className="font-semibold">Room Summary:</p>
                <p>
                  Problem:{" "}
                  <span className="font-medium">{roomConfig.problem}</span>
                </p>
                <p>
                  Max Participants:{" "}
                  <span className="font-medium">2 (1-on-1 session)</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-action flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
          <button className="btn btn-ghost w-full sm:w-auto" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary gap-2 w-full sm:w-auto justify-center"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
            ) : (
              <PlusIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
export default CreateSessionModal;
