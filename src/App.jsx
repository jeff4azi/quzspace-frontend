import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import CreateStudySpace from "./pages/CreateStudySpace";
import StudySpaceOverview from "./pages/StudySpaceOverview";
import QuizTaking from "./pages/QuizTaking";
import QuizResults from "./pages/QuizResults";
import QuizHistory from "./pages/QuizHistory";
import SharedSpace from "./pages/SharedSpace";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-light text-gray">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Signup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verify-otp"
              element={
                <ProtectedRoute requireAuth={false}>
                  <VerifyOtp />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/spaces"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-space"
              element={
                <ProtectedRoute>
                  <CreateStudySpace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/spaces/:id"
              element={
                <ProtectedRoute>
                  <StudySpaceOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/spaces/:id/quiz/:quizId"
              element={
                <ProtectedRoute>
                  <QuizTaking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/spaces/:id/quiz/:quizId/results"
              element={
                <ProtectedRoute>
                  <QuizResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/spaces/:id/quiz/:quizId/history"
              element={
                <ProtectedRoute>
                  <QuizHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route path="/s/:shareCode" element={<SharedSpace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
