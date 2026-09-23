import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard");

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to load dashboard");
      }

      setDashboard(response.data);
    } catch (err) {
      console.error("Dashboard frontend error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load dashboard",
      );
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return <DashboardSkeleton />;
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#0D1421] border border-[#1B2638] rounded-3xl p-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xl">
            !
          </div>

          <h2 className="text-xl font-bold mt-5">Couldn't load dashboard</h2>

          <p className="text-[#94A3B8] text-sm mt-2">{error}</p>

          <button
            onClick={loadDashboard}
            className="mt-6 px-5 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] transition font-semibold"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Safe data
  // --------------------------------------------------

  const overview = dashboard?.overview || {
    subjects: 0,
    documents: 0,
    topics: 0,
    concepts: 0,
  };

  const subjects = dashboard?.subjects || [];
  const weakConcepts = dashboard?.weak_concepts || [];
  const recentAttempts = dashboard?.recent_attempts || [];

  const firstName = user?.name ? user.name.split(" ")[0] : "Student";

  const hasContent = overview.subjects > 0 || overview.documents > 0;

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex">
      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="hidden lg:flex w-[250px] shrink-0 border-r border-[#182233] bg-[#090E18] flex-col fixed inset-y-0 left-0 z-40">
        {/* Logo */}

        <div className="h-[76px] px-6 flex items-center border-b border-[#182233]">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center">
              <span className="text-lg">◈</span>
            </div>

            <span className="text-xl font-bold tracking-tight">
              Revise<span className="text-[#8B5CF6]">AI</span>
            </span>
          </button>
        </div>

        {/* Navigation */}

        <div className="px-4 py-6 flex-1">
          <p className="px-3 text-[10px] uppercase tracking-[0.18em] text-[#475569] font-bold mb-3">
            Workspace
          </p>

          <SidebarItem
            icon="⌂"
            label="Dashboard"
            active
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            icon="▣"
            label="My Notes"
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            icon="◷"
            label="Revision Plan"
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            icon="◇"
            label="Flashcards"
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            icon="?"
            label="Questions"
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            icon="✓"
            label="Tests"
            onClick={() => navigate("/dashboard")}
          />

          <p className="px-3 text-[10px] uppercase tracking-[0.18em] text-[#475569] font-bold mb-3 mt-8">
            Insights
          </p>

          <SidebarItem
            icon="◒"
            label="Progress"
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            icon="▥"
            label="Analytics"
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            icon="⚙"
            label="Settings"
            onClick={() => navigate("/dashboard")}
          />
        </div>

        {/* Bottom */}

        <div className="p-4 border-t border-[#182233]">
          <div className="rounded-2xl bg-[#0D1421] border border-[#1B2638] p-4">
            <p className="text-xs text-[#64748B]">Today's Goal</p>

            <p className="text-sm font-semibold mt-2">
              {hasContent
                ? `${overview.documents} notes ready`
                : "Start your first revision"}
            </p>

            <div className="mt-3 h-1.5 bg-[#1B2638] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] rounded-full"
                style={{
                  width: hasContent ? "35%" : "0%",
                }}
              />
            </div>

            <p className="text-[11px] text-[#64748B] mt-2">
              {hasContent ? "Keep going" : "Upload notes to begin"}
            </p>
          </div>
        </div>
      </aside>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="flex-1 lg:ml-[250px] min-w-0">
        {/* TOPBAR */}

        <header className="h-[76px] border-b border-[#182233] bg-[#090E18]/90 backdrop-blur-xl sticky top-0 z-30">
          <div className="h-full px-5 md:px-8 flex items-center justify-between gap-5">
            {/* Mobile logo */}

            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center">
                ◈
              </div>

              <span className="font-bold">
                Revise<span className="text-[#8B5CF6]">AI</span>
              </span>
            </div>

            {/* Search */}

            <div className="hidden md:flex max-w-xl flex-1">
              <div className="w-full h-11 rounded-xl bg-[#0D1421] border border-[#1B2638] flex items-center px-4 gap-3">
                <span className="text-[#64748B]">⌕</span>

                <input
                  className="bg-transparent outline-none text-sm text-white placeholder:text-[#475569] w-full"
                  placeholder="Search topics, notes, questions..."
                />

                <span className="text-[10px] text-[#475569] border border-[#263449] rounded px-2 py-1">
                  Ctrl K
                </span>
              </div>
            </div>

            {/* Right */}

            <div className="flex items-center gap-3 ml-auto">
              <button className="w-10 h-10 rounded-xl border border-[#1B2638] bg-[#0D1421] text-[#94A3B8] hover:text-white transition">
                ☼
              </button>

              <button className="w-10 h-10 rounded-xl border border-[#1B2638] bg-[#0D1421] text-[#94A3B8] hover:text-white transition relative">
                ♧
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#7C3AED] text-[9px] flex items-center justify-center text-white">
                  2
                </span>
              </button>

              <div className="hidden sm:flex items-center gap-3 pl-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center text-sm font-bold">
                  {firstName.charAt(0).toUpperCase()}
                </div>

                <div className="hidden xl:block">
                  <p className="text-sm font-semibold">
                    {user?.name || "Student"}
                  </p>

                  <p className="text-[10px] text-[#64748B]">Student</p>
                </div>

                <button
                  onClick={logout}
                  className="text-[#64748B] hover:text-red-400 transition ml-1"
                  title="Logout"
                >
                  ↪
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <div className="px-5 md:px-8 py-7 max-w-[1500px] mx-auto">
          {/* GREETING */}

          <div className="mb-7">
            <p className="text-[#64748B] text-sm">Your learning workspace</p>

            <h1 className="text-2xl md:text-3xl font-bold mt-1">
              Good morning, {firstName}. <span className="text-lg">👋</span>
            </h1>

            <p className="text-[#64748B] text-sm mt-2">
              Let's revise and strengthen your memory today.
            </p>
          </div>

          {/* ==================================================
              STATS
          ================================================== */}

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon="◈"
              iconClass="bg-purple-500/10 text-purple-400"
              value={overview.subjects}
              label="Subjects"
              subtitle="Your study subjects"
            />

            <StatCard
              icon="▣"
              iconClass="bg-blue-500/10 text-blue-400"
              value={overview.documents}
              label="Notes"
              subtitle="Uploaded documents"
            />

            <StatCard
              icon="◎"
              iconClass="bg-emerald-500/10 text-emerald-400"
              value={overview.topics}
              label="Topics"
              subtitle="AI identified"
            />

            <StatCard
              icon="✦"
              iconClass="bg-orange-500/10 text-orange-400"
              value={overview.concepts}
              label="Concepts"
              subtitle="Knowledge points"
            />
          </div>

          {!hasContent ? (
            <EmptyDashboard onCreate={() => navigate("/dashboard")} />
          ) : (
            <>
              {/* ==================================================
                  MAIN GRID
              ================================================== */}

              <div className="grid xl:grid-cols-[1fr_330px] gap-5">
                {/* LEFT */}

                <div className="space-y-5">
                  {/* Subjects */}

                  <section className="bg-[#0D1421] border border-[#1B2638] rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#182233] flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold">Your Subjects</h2>

                        <p className="text-xs text-[#64748B] mt-1">
                          Continue where you left off
                        </p>
                      </div>

                      <button
                        onClick={() => navigate("/dashboard")}
                        className="text-xs text-[#8B5CF6] hover:text-[#A78BFA]"
                      >
                        View all →
                      </button>
                    </div>

                    <div className="p-5 grid md:grid-cols-2 gap-4">
                      {subjects.slice(0, 6).map((subject, index) => (
                        <SubjectCard
                          key={subject.id}
                          subject={subject}
                          index={index}
                          onClick={() => navigate(`/subjects/${subject.id}`)}
                        />
                      ))}
                    </div>
                  </section>

                  {/* Recent attempts */}

                  <section className="bg-[#0D1421] border border-[#1B2638] rounded-2xl">
                    <div className="px-5 py-4 border-b border-[#182233]">
                      <h2 className="font-semibold">Recent Activity</h2>

                      <p className="text-xs text-[#64748B] mt-1">
                        Your latest revision activity
                      </p>
                    </div>

                    {recentAttempts.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-sm text-[#94A3B8]">
                          No quiz attempts yet.
                        </p>

                        <p className="text-xs text-[#475569] mt-1">
                          Take your first quiz after uploading notes.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#182233]">
                        {recentAttempts.map((attempt) => (
                          <div
                            key={attempt.id}
                            className="px-5 py-4 flex items-center justify-between"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                {attempt.document_title}
                              </p>

                              <p className="text-xs text-[#64748B] mt-1">
                                Quiz completed
                              </p>
                            </div>

                            <span className="text-sm font-bold">
                              {attempt.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>

                {/* RIGHT */}

                <div className="space-y-5">
                  {/* Quick Actions */}

                  <section className="bg-[#0D1421] border border-[#1B2638] rounded-2xl p-5">
                    <h2 className="font-semibold">Quick Actions</h2>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <QuickAction
                        icon="↑"
                        title="Upload Notes"
                        color="purple"
                        onClick={() => navigate("/dashboard")}
                      />

                      <QuickAction
                        icon="✓"
                        title="Generate Quiz"
                        color="blue"
                        onClick={() => navigate("/dashboard")}
                      />

                      <QuickAction
                        icon="▤"
                        title="Study Topics"
                        color="green"
                        onClick={() => navigate("/dashboard")}
                      />

                      <QuickAction
                        icon="✦"
                        title="Ask AI"
                        color="pink"
                        onClick={() => navigate("/dashboard")}
                      />
                    </div>
                  </section>

                  {/* Weak concepts */}

                  <section className="bg-[#0D1421] border border-[#1B2638] rounded-2xl">
                    <div className="px-5 py-4 border-b border-[#182233]">
                      <h2 className="font-semibold">Weak Concepts</h2>

                      <p className="text-xs text-[#64748B] mt-1">
                        Concepts that need more revision
                      </p>
                    </div>

                    {weakConcepts.length === 0 ? (
                      <div className="p-6 text-center">
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                          ✓
                        </div>

                        <p className="text-sm font-medium mt-3">
                          No weak concepts yet
                        </p>

                        <p className="text-xs text-[#64748B] mt-1">
                          Quiz performance will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 space-y-3">
                        {weakConcepts.map((concept) => (
                          <div
                            key={concept.id}
                            className="p-3 rounded-xl bg-[#090E18] border border-[#182233]"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">
                                {concept.name}
                              </p>

                              <span className="text-xs text-red-400">
                                {concept.accuracy}%
                              </span>
                            </div>

                            <div className="mt-2 h-1.5 bg-[#1B2638] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500 rounded-full"
                                style={{
                                  width: `${concept.accuracy}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   SIDEBAR ITEM
============================================================ */

function SidebarItem({ icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition mb-1 ${
        active
          ? "bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] text-white shadow-lg shadow-purple-900/20"
          : "text-[#94A3B8] hover:text-white hover:bg-[#0D1421]"
      }`}
    >
      <span className="w-5 text-center">{icon}</span>

      <span>{label}</span>
    </button>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({ icon, iconClass, value, label, subtitle }) {
  return (
    <div className="bg-[#0D1421] border border-[#1B2638] rounded-2xl p-4 hover:border-[#29384F] transition">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-2xl font-bold">{value}</p>

          <p className="text-xs text-[#94A3B8]">{label}</p>
        </div>
      </div>

      <p className="text-[11px] text-[#475569] mt-3">{subtitle}</p>
    </div>
  );
}

/* ============================================================
   SUBJECT CARD
============================================================ */

function SubjectCard({ subject, index, onClick }) {
  const accents = [
    "from-purple-500/20 to-purple-500/5 border-purple-500/20",
    "from-blue-500/20 to-blue-500/5 border-blue-500/20",
    "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
    "from-orange-500/20 to-orange-500/5 border-orange-500/20",
  ];

  const icons = ["◈", "◇", "◎", "▣"];

  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-xl border bg-gradient-to-br ${
        accents[index % accents.length]
      } hover:scale-[1.01] transition`}
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-[#090E18]/80 flex items-center justify-center">
          {icons[index % icons.length]}
        </div>

        <span className="text-[#64748B]">→</span>
      </div>

      <h3 className="font-semibold mt-4 truncate">{subject.name}</h3>

      <p className="text-xs text-[#64748B] mt-1 line-clamp-1">
        {subject.description || "Your study subject"}
      </p>

      <div className="flex items-center gap-3 mt-4 text-[11px] text-[#64748B]">
        <span>{subject.document_count || 0} notes</span>

        <span>{subject.topic_count || 0} topics</span>
      </div>
    </button>
  );
}

/* ============================================================
   QUICK ACTION
============================================================ */

function QuickAction({ icon, title, color, onClick }) {
  const colors = {
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/10",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/10",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/10",
    pink: "bg-pink-500/10 text-pink-400 border-pink-500/10",
  };

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border ${colors[color]} text-left hover:brightness-125 transition`}
    >
      <div className="text-lg">{icon}</div>

      <p className="text-xs font-semibold mt-3 text-white">{title}</p>
    </button>
  );
}

/* ============================================================
   EMPTY DASHBOARD
============================================================ */

function EmptyDashboard({ onCreate }) {
  return (
    <section className="relative overflow-hidden bg-[#0D1421] border border-[#1B2638] rounded-3xl p-8 md:p-14 text-center">
      {/* Glow */}

      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center text-2xl shadow-xl shadow-purple-900/20">
          ✦
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mt-6">
          Welcome to ReviseAI
        </h2>

        <p className="max-w-lg mx-auto text-[#94A3B8] mt-3 leading-relaxed">
          Your personal AI-powered revision workspace is ready. Create a subject
          and upload your first notes to begin.
        </p>

        <button
          onClick={onCreate}
          className="mt-7 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#8B5CF6] hover:to-[#7C3AED] transition font-semibold shadow-lg shadow-purple-900/20"
        >
          + Create your first subject
        </button>

        <div className="grid md:grid-cols-3 gap-3 max-w-2xl mx-auto mt-10">
          <MiniFeature
            icon="↑"
            title="Upload notes"
            text="Add your study material"
          />

          <MiniFeature
            icon="✦"
            title="AI analysis"
            text="Extract concepts automatically"
          />

          <MiniFeature
            icon="✓"
            title="Take quizzes"
            text="Test your understanding"
          />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   MINI FEATURE
============================================================ */

function MiniFeature({ icon, title, text }) {
  return (
    <div className="p-4 rounded-xl bg-[#090E18] border border-[#182233]">
      <div className="text-[#8B5CF6]">{icon}</div>

      <p className="text-xs font-semibold mt-2">{title}</p>

      <p className="text-[10px] text-[#475569] mt-1">{text}</p>
    </div>
  );
}

/* ============================================================
   LOADING
============================================================ */

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#070B14] text-white flex">
      <aside className="hidden lg:block w-[250px] bg-[#090E18] border-r border-[#182233]" />

      <main className="flex-1">
        <div className="h-[76px] bg-[#090E18] border-b border-[#182233]" />

        <div className="p-8">
          <div className="animate-pulse">
            <div className="w-48 h-4 bg-[#1B2638] rounded" />

            <div className="w-72 h-8 bg-[#1B2638] rounded mt-4" />

            <div className="grid grid-cols-4 gap-4 mt-8">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 bg-[#0D1421] border border-[#1B2638] rounded-2xl"
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-5 mt-6">
              <div className="col-span-2 h-80 bg-[#0D1421] border border-[#1B2638] rounded-2xl" />

              <div className="h-80 bg-[#0D1421] border border-[#1B2638] rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
