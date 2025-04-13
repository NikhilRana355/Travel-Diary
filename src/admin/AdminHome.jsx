import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BACKEND_URL = "http://localhost:3022"; // Update if deployed

export const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [diaries, setDiaries] = useState([]);
  const [stats, setStats] = useState({ users: 0, diaries: 0, itineraries: 0, inactiveUsers: 0 });
  const [chartData, setChartData] = useState(null);
  const [topUsers, setTopUsers] = useState([]);

  // ✅ Reusable fetch function
  const fetchAll = async () => {
    try {
      const [userRes, diaryRes, itinRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/users`),
        axios.get(`${BACKEND_URL}/diary/alldiaries`),
        axios.get(`${BACKEND_URL}/itin/itinerary/total`),
      ]);

      const allUsers = userRes.data.data || [];
      const activeUsers = allUsers.filter((u) => u.isActive !== false);
      const inactiveUsers = allUsers.filter((u) => u.isActive === false);
      const diariesList = diaryRes.data || [];
      const itineraryTotal = itinRes.data.total || 0;

      setUsers(allUsers);
      setDiaries(diariesList);

      setStats({
        users: activeUsers.length,
        inactiveUsers: inactiveUsers.length,
        diaries: diariesList.length,
        itineraries: itineraryTotal,
      });

      const userPostCount = {};
      diariesList.forEach((diary) => {
        const id = diary.userId;
        if (id) userPostCount[id] = (userPostCount[id] || 0) + 1;
      });

      const top = Object.entries(userPostCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([id, count]) => {
          const user = activeUsers.find((u) => u._id === id);
          return user ? { ...user, count } : null;
        })
        .filter(Boolean);

      setTopUsers(top);

      setChartData({
        labels: top.map((u) => u.userName || u.fullName || "Unnamed"),
        datasets: [
          {
            label: "Number of Diaries",
            data: top.map((u) => u.count),
            backgroundColor: "#f39c12",
          },
        ],
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSoftDeleteUser = async (userId) => {
    if (!window.confirm("Mark this user as inactive?")) return;
    try {
      await axios.put(`${BACKEND_URL}/user/soft-delete/${userId}`);
      fetchAll(); // 🔁 auto-refresh
    } catch (err) {
      console.error("Soft delete failed:", err.message);
      alert("Could not deactivate user.");
    }
  };

  const handleReactivateUser = async (userId) => {
    if (!window.confirm("Reactivate this user?")) return;
    try {
      await axios.put(`${BACKEND_URL}/user/reactivate/${userId}`);
      fetchAll(); // 🔁 auto-refresh
    } catch (err) {
      console.error("Reactivate failed:", err.message);
      alert("Could not reactivate user.");
    }
  };

  return (
    <div style={{ padding: "2rem", background: "#f4f6f9", minHeight: "100vh" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>📊 Admin Dashboard</h2>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
        <StatCard title="Total Users" value={stats.users} bg="#3498db" icon="👤" />
        <StatCard title="Total Diaries" value={stats.diaries} bg="#27ae60" icon="📓" />
        <StatCard title="Total Itineraries" value={stats.itineraries} bg="#f39c12" icon="🗺️" />
        <StatCard title="Inactive Users" value={stats.inactiveUsers} bg="#e74c3c" icon="🚫" />
      </div>

      {/* Overall Summary Chart */}
      <div
        style={{
          marginTop: "3rem",
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h4 style={{ marginBottom: "1rem" }}>📊 Overall Summary</h4>
        <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
          <Bar
            data={{
              labels: ["Users", "Diaries", "Itineraries", "Inactive Users"],
              datasets: [
                {
                  label: "Total Count",
                  data: [stats.users, stats.diaries, stats.itineraries, stats.inactiveUsers],
                  backgroundColor: ["#3498db", "#27ae60", "#f39c12", "#e74c3c"],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
            }}
          />
        </div>
      </div>

      {/* All Active Users */}
      <div style={{ marginTop: "3rem" }}>
        <h4 style={{ marginBottom: "1rem" }}>All Active Users</h4>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {users
            .filter((user) => user.isActive !== false)
            .map((user) => (
              <div
                key={user._id}
                style={{
                  background: "#fff",
                  padding: "1rem",
                  borderRadius: "10px",
                  width: "230px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={user.profilePic}
                  alt={user.fullName}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />
                <h5>{user.fullName || "Unnamed"}</h5>
                <p style={{ fontSize: "0.85rem", color: "#666" }}>@{user.userName}</p>
                <p style={{ fontSize: "0.8rem", color: "#888" }}>{user.email}</p>
                <button
                  onClick={() => handleSoftDeleteUser(user._id)}
                  style={{
                    marginTop: "10px",
                    padding: "6px 12px",
                    background: "#e67e22",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  🚫 Deactivate
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Inactive Users */}
      <div style={{ marginTop: "3rem" }}>
        <h4 style={{ marginBottom: "1rem", color: "red" }}>Inactive Users</h4>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {users
            .filter((user) => user.isActive === false)
            .map((user) => (
              <div
                key={user._id}
                style={{
                  background: "#ffe6e6",
                  padding: "1rem",
                  borderRadius: "10px",
                  width: "230px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={user.profilePic}
                  alt={user.fullName}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "10px",
                    border: "2px solid red",
                  }}
                />
                <h5>{user.fullName || "Unnamed"}</h5>
                <p style={{ fontSize: "0.85rem", color: "#666" }}>@{user.userName}</p>
                <p style={{ fontSize: "0.8rem", color: "#888" }}>{user.email}</p>
                <p style={{ marginTop: "5px", color: "red", fontWeight: "bold" }}>
                  ❌ Inactive
                </p>
                <button
                  onClick={() => handleReactivateUser(user._id)}
                  style={{
                    marginTop: "10px",
                    padding: "6px 12px",
                    background: "#27ae60",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  ✅ Activate
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Top Travelers Chart */}
      <div
        style={{
          marginTop: "3rem",
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h4 style={{ marginBottom: "1rem" }}>Top Travelers (by Diary Posts)</h4>
        {chartData ? (
          <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
            <Bar data={chartData} />
          </div>
        ) : (
          <p style={{ color: "gray" }}>No data available to display chart.</p>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, bg, icon }) => (
  <div
    style={{
      background: bg,
      color: "#fff",
      padding: "1rem",
      borderRadius: "10px",
      flex: "1 1 200px",
      minWidth: "200px",
    }}
  >
    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</div>
    <p style={{ margin: 0 }}>{title}</p>
    <h3 style={{ margin: "0.5rem 0", fontSize: "1.8rem" }}>{value}</h3>
  </div>
);
