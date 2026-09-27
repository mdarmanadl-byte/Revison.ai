import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Subject from "./pages/Subject";
import Document from "./pages/Document";
import Quiz from "./pages/Quiz";
import Progress from "./pages/Progress";
import WeakConcepts from "./pages/WeakConcepts";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

function App() {
  return (
  
      <Routes>
        {/* ================= PUBLIC ================= */}

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        {/* ================= PROTECTED ================= */}

        <Route element={<ProtectedRoute />}>
          {/* Layout mounted ONLY ONCE */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/subjects" element={<Subjects />} />

            <Route path="/subjects/:id" element={<Subject />} />

            <Route path="/documents/:id" element={<Document />} />

            <Route path="/documents/:id/quiz" element={<Quiz />} />

            <Route path="/quizzes" element={<Quiz />} />

            <Route path="/progress" element={<Progress />} />

            <Route path="/weak-topics" element={<WeakConcepts />} />

            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
   
  );
}

export default App;
