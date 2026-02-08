import { NavLink } from "react-router-dom";
import "../styles/layout.css";

export default function Sidebar({ role }) {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="nav-item">Home</NavLink>

      {role === "CREATOR" && (
        <>
          <NavLink to="/creator" className="nav-item">Dashboard</NavLink>
          <NavLink to="/timeline" className="nav-item">Timeline</NavLink>
        </>
      )}

      {role === "VERIFIER" && (
        <>
          <NavLink to="/verifier" className="nav-item">Dashboard</NavLink>
          <NavLink to="/timeline" className="nav-item">Timeline</NavLink>
        </>
      )}

      {role === "ADMIN" && (
        <>
          <NavLink to="/admin" className="nav-item">Dashboard</NavLink>
          <NavLink to="/users" className="nav-item">Manage Users</NavLink>
          <NavLink to="/stats" className="nav-item">System Stats</NavLink>
        </>
      )}

      <NavLink to="/settings" className="nav-item">Settings</NavLink>
      <NavLink to="/" className="nav-item">Logout</NavLink>
    </aside>
  );
}