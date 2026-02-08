import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/timeline.css";

export default function TimelinePage() {
  const [logs, setLogs] = useState([]);
  const role = localStorage.getItem("userRole"); // "CREATOR" or "VERIFIER"

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        let res;
        if (role === "CREATOR") {
          // Creator timeline (FootprintTimelineView)
          res = await api.get("/audit/timeline/");
          setLogs(res.data.digital_footprints || []);
        } else {
          // Verifier timeline (Audit logs)
          res = await api.get("/audit/logs/");
          setLogs(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch timeline logs", err);
      }
    };

    fetchLogs();
  }, [role]);

  const filteredLogs =
    role === "CREATOR"
      ? logs // show all creator logs
      : logs.filter((log) =>
          ["Original", "Copied", "Partially Copied / Modified"].includes(log.result)
        );

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar role={role} />
        <main className="dashboard-main">
          <h1 className="page-title">
            {role === "CREATOR"
              ? "My Digital Footprints Timeline"
              : "Verifier Activity Timeline"}
          </h1>

          <div className="timeline-container">
            {filteredLogs.length > 0 ? (
              filteredLogs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className={`timeline-card ${log.result?.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="timeline-icon">
                    {log.result === "Original" && "✅"}
                    {log.result === "Copied" && "⚠️"}
                    {log.result === "Partially Copied / Modified" && "📝"}
                    {role === "CREATOR" && log.result === "Uploaded" && "📤"}
                  </div>
                  <div className="timeline-details">
                    <h3>{log.file_name || "Unnamed File"}</h3>
                    <p className="timeline-action">{log.action || "Verification"}</p>
                    <p className="timeline-result">{log.result}</p>
                    <span className="timeline-date">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No activity found.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}