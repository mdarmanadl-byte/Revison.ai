import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "../ui/Icon";

const titles = {
  "/dashboard": "Dashboard",
  "/subjects": "My Subjects",
  "/quizzes": "Quizzes",
  "/progress": "Progress",
  "/weak-topics": "Weak Concepts",
  "/settings": "Settings",
};

function Navbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const name = user?.name || "Student";
  const email = user?.email || "";
  const initial = name.charAt(0).toUpperCase();

  const title = titles[location.pathname] || "Study Workspace";

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-30 h-[88px] bg-[#070B14]">
      <div className="flex h-full items-center px-5 lg:px-9">
        {/* Page title */}
        <div className="flex min-w-[200px] items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-xl border border-[#1B2638] bg-[#0D1421] p-2.5 text-slate-400 lg:hidden"
          >
            <Icon name="menu" size={19} />
          </button>

          <div>
            <p className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-slate-600 sm:block">
              Workspace
            </p>

            <h1 className="text-[22px] font-semibold tracking-tight text-white">
              {title}
            </h1>
          </div>
        </div>

        {/* Search */}
        <div className="mx-auto hidden w-full max-w-[620px] md:block">
          <div className="flex h-[54px] items-center gap-3 rounded-[15px] border border-[#1B2638] bg-[#0D1421] px-4">
            <Icon name="search" size={19} className="text-slate-400" />

            <input
              placeholder="Search subjects, notes, concepts..."
              className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
            />

            <kbd className="rounded-lg border border-[#263247] px-2 py-1 text-[9px] text-slate-600">
              /
            </kbd>
          </div>
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/quizzes")}
            className="hidden h-[46px] items-center gap-2 rounded-[14px] border border-violet-500/20 bg-violet-500/[0.08] px-4 text-sm font-medium text-violet-300 hover:bg-violet-500/[0.13] sm:flex"
          >
            <Icon name="spark" size={17} />
            AI Quiz
          </button>

          <button className="relative flex h-[46px] w-[46px] items-center justify-center rounded-[14px] border border-[#1B2638] bg-[#0D1421] text-slate-400 hover:text-white">
            <Icon name="bell" size={19} />

            <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-violet-500" />
          </button>

          {/* NO DIVIDER */}

          <div className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-white/[0.03]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-sm font-bold">
                {initial}
              </div>

              <div className="hidden text-left lg:block">
                <p className="text-xs font-semibold text-slate-200">{name}</p>

                <p className="text-[10px] text-slate-600">Student</p>
              </div>

              <span className="hidden text-slate-600 lg:block">
                <Icon name="chevron" size={15} />
              </span>
            </button>

            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                />

                <div className="absolute right-0 top-14 z-50 w-56 rounded-2xl border border-[#243149] bg-[#0D1421] p-2 shadow-2xl">
                  <div className="border-b border-[#1B2638] px-3 py-3">
                    <p className="text-xs font-semibold text-white">{name}</p>

                    <p className="mt-1 truncate text-[10px] text-slate-500">
                      {email}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/settings")}
                    className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-xs text-slate-400 hover:bg-white/[0.04] hover:text-white"
                  >
                    Account settings
                  </button>

                  <button
                    onClick={logout}
                    className="w-full rounded-xl px-3 py-2.5 text-left text-xs text-red-400 hover:bg-red-500/10"
                  >
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
