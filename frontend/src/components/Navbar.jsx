import { Link, useLocation } from "react-router";
import {
  SparklesIcon,
  BookOpenIcon,
  LayoutDashboardIcon,
  MenuIcon,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useState } from "react";

function Navbar() {
  const location = useLocation();

  console.log(location);

  const isActive = (path) => location.pathname === path;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();

  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between flex-wrap sm:flex-nowrap">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-3 hover:scale-105 transition-transform duration-200"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
            <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg sm:text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
              Intervinger
            </span>
            <span className="text-xs sm:text-sm text-base-content/60 font-medium -mt-1">
              Code Together
            </span>
          </div>
        </Link>

        {/* HAMBURGER BUTTON FOR SMALL SCREENS */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="sm:hidden p-2 rounded-lg hover:bg-base-200 transition-colors"
        >
          <MenuIcon className="w-5 h-5 text-base-content" />
        </button>

        {/* LINKS & USER FOR LARGE SCREENS */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-4">
          <Link
            to="/problems"
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg transition-all duration-200 ${
              isActive("/problems")
                ? "bg-primary text-primary-content"
                : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpenIcon className="w-4 h-4" />
              <span className="font-medium">Problems</span>
            </div>
          </Link>

          <Link
            to="/dashboard"
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg transition-all duration-200 ${
              isActive("/dashboard")
                ? "bg-primary text-primary-content"
                : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
            }`}
          >
            <div className="flex items-center gap-2">
              <LayoutDashboardIcon className="w-4 h-4" />
              <span className="font-medium">Dashboard</span>
            </div>
          </Link>

          <UserButton />
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="sm:hidden mt-2 px-4 pb-4 flex flex-col gap-3 bg-base-100 border-t border-base-300 shadow-md rounded-b-lg">
          {/* User Profile on top */}
          <div className="flex items-center gap-3 p-2 bg-base-200 rounded-lg">
            <UserButton />
            <span className="font-medium text-base-content/90">
              {user?.firstName} {user?.lastName}
            </span>
          </div>

          {/* Mobile Links */}
          <Link
            to="/problems"
            className={`px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive("/problems")
                ? "bg-primary text-primary-content"
                : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpenIcon className="w-4 h-4" />
              <span className="font-medium">Problems</span>
            </div>
          </Link>

          <Link
            to="/dashboard"
            className={`px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive("/dashboard")
                ? "bg-primary text-primary-content"
                : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
            }`}
          >
            <div className="flex items-center gap-2">
              <LayoutDashboardIcon className="w-4 h-4" />
              <span className="font-medium">Dashboard</span>
            </div>
          </Link>
        </div>
      )}
    </nav>
  );
}
export default Navbar;
