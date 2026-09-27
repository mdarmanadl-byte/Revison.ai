function Settings() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-8">
          <p className="text-sm text-slate-500">Account</p>

          <h1 className="mt-1 text-2xl font-bold text-white">Settings</h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your ReviseAI preferences.
          </p>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-[#1B2638] bg-[#0D1421] p-6">
            <h2 className="text-sm font-semibold text-white">Profile</h2>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs text-slate-500">Name</label>

                <input
                  defaultValue={user?.name || ""}
                  className="mt-2 w-full rounded-xl border border-[#1B2638] bg-[#090E18] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500">Email</label>

                <input
                  defaultValue={user?.email || ""}
                  className="mt-2 w-full rounded-xl border border-[#1B2638] bg-[#090E18] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#1B2638] bg-[#0D1421] p-6">
            <h2 className="text-sm font-semibold text-white">Preferences</h2>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-[#090E18] p-4">
              <div>
                <p className="text-sm text-slate-300">
                  AI-generated study material
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Automatically generate summaries and concepts.
                </p>
              </div>

              <div className="h-6 w-11 rounded-full bg-violet-600 p-1">
                <div className="h-4 w-4 translate-x-5 rounded-full bg-white" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Settings;
