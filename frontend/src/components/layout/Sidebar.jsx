import { NavLink, useNavigate } from "react-router-dom";
import Icon from "../ui/Icon";

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "dashboard",
    end: true,
  },
  {
    label: "My Subjects",
    path: "/subjects",
    icon: "subjects",
  },
  {
    label: "Quizzes",
    path: "/quizzes",
    icon: "quiz",
  },
  {
    label: "Progress",
    path: "/progress",
    icon: "progress",
  },
];

function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const name = user?.name || "Student";
  const email = user?.email || "";
  const initial = name.charAt(0).toUpperCase();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[260px] flex-col
          bg-[#090E18]
          transition-transform duration-300
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-[88px] shrink-0 items-center px-5">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/20">
              <Icon name="brain" size={26} />
            </div>

            <div className="text-left">
              <div className="text-[18px] font-bold tracking-tight text-white">
                Revise<span className="text-violet-400">AI</span>
              </div>

              <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
                Smart Learning
              </div>
            </div>
          </button>

          <button
            onClick={onClose}
            className="ml-auto text-slate-500 lg:hidden"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Scrollable navigation */}
        <div className="sidebar-scroll min-h-0 flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) => `
                  group relative flex h-[50px] items-center gap-3
                  rounded-[14px] px-4
                  text-[14px] font-medium
                  transition
                  ${
                    isActive
                      ? "bg-violet-500/[0.13] text-white"
                      : "text-slate-400 hover:bg-white/[0.035] hover:text-slate-200"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 h-7 w-[3px] rounded-r-full bg-violet-500" />
                    )}

                    <span
                      className={
                        isActive
                          ? "text-violet-400"
                          : "text-slate-500 group-hover:text-slate-300"
                      }
                    >
                      <Icon name={item.icon} size={20} />
                    </span>

                    <span>{item.label}</span>

                    {item.label === "Quizzes" && (
                      <span className="ml-auto rounded-md bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-violet-400">
                        AI
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <p className="mb-3 mt-9 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Intelligence
          </p>

          <NavLink
            to="/weak-topics"
            onClick={onClose}
            className={({ isActive }) => `
              group flex h-[50px] items-center gap-3 rounded-[14px]
              px-4 text-[14px] font-medium transition
              ${
                isActive
                  ? "bg-violet-500/[0.13] text-white"
                  : "text-slate-400 hover:bg-white/[0.035] hover:text-slate-200"
              }
            `}
          >
            <span className="text-slate-500 group-hover:text-violet-400">
              <Icon name="brain" size={20} />
            </span>
            Weak Concepts
          </NavLink>

          <div className="mt-8 rounded-2xl border border-violet-500/10 bg-violet-500/[0.04] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">
                Study streak
              </span>

              <span className="text-xs font-semibold text-violet-400">
                🔥 0
              </span>
            </div>

            <div className="mt-3 h-1.5 rounded-full bg-slate-800">
              <div className="h-full w-[10%] rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
            </div>

            <p className="mt-2 text-[10px] text-slate-600">
              Start studying to build your streak
            </p>
          </div>
        </div>

        {/* Fixed footer */}
        <div className="shrink-0 p-3">
          <NavLink
            to="/settings"
            onClick={onClose}
            className="flex h-11 items-center gap-3 rounded-xl px-3 text-[13px] text-slate-400 hover:bg-white/[0.035] hover:text-white"
          >
            <Icon name="settings" size={18} />
            Settings
          </NavLink>

          <div className="mt-1 flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-sm font-bold">
              {initial}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-200">
                {name}
              </p>

              <p className="truncate text-[10px] text-slate-500">{email}</p>
            </div>

            <button
              onClick={logout}
              className="rounded-lg p-2 text-slate-600 hover:bg-red-500/10 hover:text-red-400"
            >
              <Icon name="logout" size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
