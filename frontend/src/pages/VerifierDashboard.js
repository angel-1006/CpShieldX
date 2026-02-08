import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VerificationForm from "../features/verifier/VerificationForm";
import VerificationResult from "../features/verifier/VerificationResult";
import "../styles/verifier.css";

export default function VerifierDashboard() {
  const [verificationData, setVerificationData] = useState(null);
  const [stats, setStats] = useState({
    verified_files: 0,
    duplicates_found: 0,
    pending_reviews: 0,
  });
  const [recentLogs, setRecentLogs] = useState([]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/content/stats/");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Fetch recent verifications (AuditLog)
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/audit/logs/"); // adjust to your actual endpoint
        setRecentLogs(res.data);
      } catch (err) {
        console.error("Failed to fetch recent verifications", err);
      }
    };

    fetchLogs();
  }, [verificationData]); // refresh logs whenever a new verification happens

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar role="VERIFIER" />
        <main className="dashboard-main">
          <h1 className="page-title">Verifier Dashboard</h1>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <h2>✅ Verified Files</h2>
              <p>{stats.verified_files}</p>
            </div>
            <div className="stat-card">
              <h2>⚠️ Duplicates Found</h2>
              <p>{stats.duplicates_found}</p>
            </div>
            <div className="stat-card">
              <h2>📜 Pending Reviews</h2>
              <p>{stats.pending_reviews}</p>
            </div>
          </div>

          {/* Verification Section */}
          <div className="verify-section">
            <div className="card animate-card">
              <VerificationForm onVerifySuccess={setVerificationData} />
            </div>
            {verificationData && (
              <div className="card animate-card">
                <VerificationResult data={verificationData} />
              </div>
            )}
          </div>

          {/* Recent Verifications */}
          <div className="card animate-card">
  <h2>Recent Verifications</h2>
  <table className="data-table">
    <thead>
      <tr>
        <th>File</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
  {recentLogs.length > 0 ? (
    recentLogs
      // Only show meaningful verification results
      .filter((log) =>
        ["Original", "Copied", "Partially Copied / Modified"].includes(log.result)
      )
      .slice(0, 10) // latest 10 entries only
      .map((log) => (
        <tr key={log.id}>
          <td>{log.file_name}</td>
          <td>{log.result}</td>
          <td>{new Date(log.timestamp).toLocaleString()}</td>
        </tr>
      ))
  ) : (
    <tr>
      <td colSpan="3">No recent verifications found.</td>
    </tr>
  )}
</tbody>
  </table>
</div>
        </main>
      </div>
    </div>
  );
}