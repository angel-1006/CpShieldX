import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/layout.css"
import HomePage from "./pages/HomePage";
import RegisterForm from "./features/auth/RegisterForm";
import LoginForm from "./features/auth/LoginForm";
import TimelinePage from "./pages/TimelinePage";
import SettingsPage from "./pages/SettingsPage";
import DashboardRouter from "./pages/DashboardRouter";
import ManageUsersPage from "./pages/ManageUsersPage";
import SystemStatsPage from "./pages/StatsPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/verifier" element={<DashboardRouter />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/creator" element={<DashboardRouter />} />
        <Route path="/admin" element={<DashboardRouter />} />
        <Route path="/users" element={<ManageUsersPage />} />
        <Route path="/stats" element={<SystemStatsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;