import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 w-full">
      {/* Active Count */}
      <div className="card w-full bg-base-100 border-2 border-primary/20 hover:border-primary/40">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-2xl">
              <UsersIcon className="w-5 sm:w-7 h-5 sm:h-7 text-primary" />
            </div>
            <div className="badge badge-primary">Live</div>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black mb-1">
            {activeSessionsCount}
          </div>
          <div className="text-sm sm:text-base opacity-60">Active Sessions</div>
        </div>
      </div>

      {/* Recent Count */}
      <div className="card w-full bg-base-100 border-2 border-secondary/20 hover:border-secondary/40">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 sm:p-3 bg-secondary/10 rounded-2xl">
              <TrophyIcon className="w-5 sm:w-7 h-5 sm:h-7 text-secondary" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black mb-1">
            {recentSessionsCount}
          </div>
          <div className="text-sm sm:text-base opacity-60">Total Sessions</div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
