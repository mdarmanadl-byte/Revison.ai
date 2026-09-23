import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);

      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f7f8fc]">
      {/* LEFT */}

      <div className="hidden w-1/2 bg-black p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="text-2xl font-bold">ReviseAI</div>

          <p className="mt-3 max-w-md text-gray-400">
            Your notes. Your knowledge. Your AI study partner.
          </p>
        </div>

        <div>
          <p className="max-w-lg text-4xl font-semibold leading-tight">
            Upload.
            <br />
            Understand.
            <br />
            Revise.
          </p>
        </div>

        <p className="text-sm text-gray-500">AI-powered revision workspace</p>
      </div>

      {/* RIGHT */}

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="text-2xl font-bold">ReviseAI</div>
          </div>

          <h1 className="text-3xl font-bold">Create your account</h1>

          <p className="mt-2 mb-8 text-gray-500">
            Start building your personal AI-powered study space.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Input
              label="Name"
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-black">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        {...props}
        required
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-gray-400 focus:bg-white"
      />
    </div>
  );
}

export default Signup;
