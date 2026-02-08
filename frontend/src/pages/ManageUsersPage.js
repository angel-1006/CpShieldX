import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/manageusers.css";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/adminusers/");
        setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  const updateUser = async (id, updates) => {
    try {
      const res = await api.patch(`/users/adminusers/${id}/`, updates);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...res.data } : u))
      );
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar role="ADMIN" />
        <main className="dashboard-main">
          <h1 className="page-title">Manage Users</h1>

          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email || "N/A"}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        updateUser(user.id, { role: e.target.value })
                      }
                    >
                      <option value="CREATOR">Creator</option>
                      <option value="VERIFIER">Verifier</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className={`status-btn ${
                        user.is_active ? "active" : "inactive"
                      }`}
                      onClick={() =>
                        updateUser(user.id, { is_active: !user.is_active })
                      }
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && <p>No users found.</p>}
        </main>
      </div>
    </div>
  );
}