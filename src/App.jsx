import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateStudySpace from "./pages/CreateStudySpace";
import StudySpaceOverview from "./pages/StudySpaceOverview";
import QuizTaking from "./pages/QuizTaking";
import QuizResults from "./pages/QuizResults";

function App() {
  return (
    // Apply default bg and text at root level using v4 CSS variable utilities
    <div className="min-h-screen bg-light text-gray">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/spaces" element={<Dashboard />} />
          <Route path="/spaces/:id" element={<StudySpaceOverview />} />
          <Route path="/spaces/:id/quiz/:quizId" element={<QuizTaking />} />
          <Route path="/spaces/:id/quiz/:quizId/results" element={<QuizResults />} />
          <Route path="/create-space" element={<CreateStudySpace />} />
          <Route path="/settings" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
