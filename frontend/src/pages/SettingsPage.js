import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/settings.css";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me/"); // backend endpoint for current user
        setUser(res.data);
        // preload preferences if backend supports them
        setDarkMode(res.data.preferences?.darkMode || false);
        setNotifications(res.data.preferences?.notifications || true);
        setRefreshInterval(res.data.preferences?.refreshInterval || 30);
      } catch (err) {
        console.error("Failed to fetch user details", err);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      await api.put("/users/preferences/", {
        darkMode,
        notifications,
        refreshInterval,
      });
      alert("Settings updated successfully!");
    } catch (err) {
      console.error("Failed to update settings", err);
      alert("Error saving settings");
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar role="VERIFIER" />
        <main className="dashboard-main">
          <h1 className="page-title">Settings</h1>

          <div className="settings-container">
            {/* Profile Section */}
            <section className="settings-section">
              <h2>Profile</h2>
              {user ? (
                <>
                  <div className="settings-item">
                    <label>Name:</label>
                    <span>{user.username}</span>
                  </div>
                  <div className="settings-item">
                    <label>Email:</label>
                    <span>{user.email}</span>
                  </div>
                  <div className="settings-item">
                    <label>Role:</label>
                    <span>{user.role}</span>
                  </div>
                </>
              ) : (
                <p>Loading user details...</p>
              )}
            </section>

            {/* Preferences Section */}
            <section className="settings-section">
              <h2>Preferences</h2>
              <div className="settings-item">
                <label>Dark Mode</label>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
              </div>
              <div className="settings-item">
                <label>Email Notifications</label>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
              </div>
              <div className="settings-item">
                <label>Auto-refresh interval (seconds)</label>
                <input
                  type="number"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(e.target.value)}
                  min="10"
                  max="120"
                />
              </div>
            </section>

            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}