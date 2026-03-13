import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, records: 0 });
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch dashboard stats
        const statsRes = await axios.get("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(statsRes.data);

        // Fetch all users
        const usersRes = await axios.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersRes.data);

        // Fetch all history
        const historyRes = await axios.get("/api/admin/all-history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(historyRes.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          alert("Access denied. Admins only.");
          navigate("/"); // redirect if not admin
        }
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/api/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
      alert("User deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  if (loading) return <div>Loading admin panel...</div>;

  return (
    <div className="admin-panel">
      <h1>Admin Control Panel</h1>

      <section>
        <h2>Dashboard Stats</h2>
        <p>Total Users: {stats.users}</p>
        <p>Total History Records: {stats.records}</p>
      </section>

      <section>
        <h2>All Users</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>All History</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Title</th>
              <th>User</th>
              <th>Type</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h._id}>
                <td>{h.title}</td>
                <td>{h.userId?.username || "Unknown"}</td>
                <td>{h.type}</td>
                <td>{new Date(h.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminPanel;