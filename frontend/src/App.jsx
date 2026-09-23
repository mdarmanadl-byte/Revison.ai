import { useState } from "react";

import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Subject from "./pages/Subject";
import Document from "./pages/Document";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Quiz from "./pages/Quiz";
import ProtectedRoute from "./componets/ProtectedRoute";
import Landing from "./pages/Landing";
function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subjects/:id"
        element={
          <ProtectedRoute>
            <Subject />
          </ProtectedRoute>
        }
      />
      <Route
        path="/revision/document/:id"
        element={
          <ProtectedRoute>
            <Document />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/quiz/:id"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
