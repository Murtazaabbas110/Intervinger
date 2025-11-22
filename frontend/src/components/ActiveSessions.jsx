import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";
import { getDifficultyBadgeClass } from "../lib/utils";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <div className="lg:col-span-2 card bg-base-100 border-2 border-primary/20 hover:border-primary/30 h-full">
      <div className="card-body">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3 md:gap-4 lg:gap-6">
          {/* Title + Icon */}
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <ZapIcon className="w-5 md:w-6 lg:w-6 h-5 md:h-6 lg:h-6" />
            </div>
            <h2 className="text-xl md:text-2xl lg:text-2xl font-black">
              Live Sessions
            </h2>
          </div>

          {/* Active count */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 md:w-3 lg:w-3 bg-success rounded-full" />
            <span className="text-sm md:text-base lg:text-base font-medium text-success">
              {sessions.length} active
            </span>
          </div>
        </div>

        {/* SESSIONS LIST */}
        <div className="space-y-3 max-h-[400px] md:max-h-[500px] lg:max-h-[500px] overflow-y-auto pr-2 md:pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoaderIcon className="w-10 md:w-12 lg:w-12 h-10 md:h-12 lg:h-12 animate-spin text-primary" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className="card bg-base-200 border-2 border-base-300 hover:border-primary/50 w-full"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 p-3 md:p-5">
                  {/* LEFT SIDE */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <div className="relative w-14 h-14 md:w-16 lg:w-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Code2Icon className="w-6 md:w-7 lg:w-7 h-6 md:h-7 lg:h-7 text-white" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 lg:w-4 bg-success rounded-full border-2 border-base-100" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                        <h3 className="font-bold text-sm md:text-base lg:text-lg truncate">
                          {session.problem}
                        </h3>
                        <span
                          className={`badge badge-sm ${getDifficultyBadgeClass(
                            session.difficulty
                          )}`}
                        >
                          {session.difficulty.charAt(0).toUpperCase() +
                            session.difficulty.slice(1)}
                        </span>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs md:text-sm opacity-80">
                        <div className="flex items-center gap-1.5">
                          <CrownIcon className="w-4 h-4" />
                          <span className="font-medium truncate">
                            {session.host?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="w-4 h-4" />
                          <span>{session.participant ? "2/2" : "1/2"}</span>
                        </div>
                        {session.participant && !isUserInSession(session) ? (
                          <span className="badge badge-error badge-sm">
                            FULL
                          </span>
                        ) : (
                          <span className="badge badge-success badge-sm">
                            OPEN
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE BUTTON */}
                  <div className="flex-shrink-0 mt-2 md:mt-0 w-full md:w-auto">
                    {session.participant && !isUserInSession(session) ? (
                      <button className="btn btn-disabled btn-sm w-full md:w-auto">
                        Full
                      </button>
                    ) : (
                      <Link
                        to={`/session/${session._id}`}
                        className="btn btn-primary btn-sm gap-2 w-full md:w-auto justify-center"
                      >
                        {isUserInSession(session) ? "Rejoin" : "Join"}
                        <ArrowRightIcon className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 md:w-24 lg:w-24 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center">
                <SparklesIcon className="w-10 md:w-12 lg:w-12 h-10 md:h-12 lg:h-12 text-primary/50" />
              </div>
              <p className="text-lg md:text-xl lg:text-xl font-semibold opacity-70 mb-1">
                No active sessions
              </p>
              <p className="text-sm md:text-base lg:text-base opacity-50">
                Be the first to create one!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ActiveSessions;
