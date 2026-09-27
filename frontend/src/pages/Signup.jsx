import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignup(e) {
    e.preventDefault();

    localStorage.setItem("token", "frontend-demo-token");

    localStorage.setItem(
      "user",
      JSON.stringify({
        name,
        email,
      }),
    );

    navigate("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070B14] px-5">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Create your account</h1>

          <p className="mt-2 text-sm text-slate-500">
            Start building your personalized revision workspace.
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          className="rounded-2xl border border-[#1B2638] bg-[#0D1421] p-6"
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500">Name</label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-[#1B2638] bg-[#090E18] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500">Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-[#1B2638] bg-[#090E18] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500">Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-[#1B2638] bg-[#090E18] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Create account
          </button>

          <p className="mt-5 text-center text-xs text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-400 hover:text-violet-300">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
