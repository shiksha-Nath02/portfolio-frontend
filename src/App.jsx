import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ProjectPage from "./pages/ProjectPage";
import { DevModeProvider } from "./context/DeveloperModeContext"; // <-- ADD THIS

function App() {
  return (
    <DevModeProvider> {/* <-- WRAP ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:slug" element={<ProjectPage />} />
      </Routes>
    </DevModeProvider>
  );
}

export default App;