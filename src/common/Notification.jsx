import axios from "axios";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export const Notification = ({ userId }) => {
  const storedUserId = localStorage.getItem("id");
  const effectiveUserId = userId || storedUserId;

  const [notifications, setNotifications] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [followingIds, setFollowingIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followersIds, setFollowersIds] = useState([]);


  useEffect(() => {
    if (!effectiveUserId) return;
    fetchNotifications();
    fetchFollowing();
    fetchFollowers();
  }, [effectiveUserId]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:3022/notifications/${effectiveUserId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowing = async () => {
    try {
      const res = await axios.get(`http://localhost:3022/user/following/${effectiveUserId}`);
      setFollowingIds(res.data.following.map((user) => user._id));
    } catch (err) {
      console.error("Error fetching following list:", err);
    }
  };

  const fetchFollowers = async () => {
    try {
      const res = await axios.get(`http://localhost:3022/user/followers/${effectiveUserId}`);
      setFollowersIds(res.data.followers.map((user) => user._id));
    } catch (err) {
      console.error("Error fetching followers list:", err);
    }
  };
  

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:3022/notifications/delete", {
        data: { notificationIds: selectedIds },
      });
      setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n._id)));
      setSelectedIds([]);
      setDeleteMode(false);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete notifications");
    }
  };

  const handleFollow = async (followingId) => {
    try {
      console.log("🔹 Following user:", followingId);
      console.log("🔹 Current User (effectiveUserId):", effectiveUserId);
  
      await axios.post("/user/follow", {
        followerId: effectiveUserId,
        followingId,
      });
  
      setFollowingIds((prev) => [...prev, followingId]);
  
      if (followersIds.includes(followingId)) {
        console.log("🔹 Sending follow-back notification to:", followingId);
  
        const response = await axios.post("/notifications/send", {
          receiverId: followingId,
          senderId: effectiveUserId,
          message: "Followed you back!",
          type : "follow"
        });
  
        console.log("✅ Notification sent successfully:", response.data);
      }
    } catch (err) {
      console.error("❌ Follow failed:", err.response ? err.response.data : err);
    }
  };  
  
  const handleUnfollow = async (followingId) => {
    try {
      await axios.post("http://localhost:3022/user/unfollow", {
        followerId: effectiveUserId,
        followingId,
      });
      setFollowingIds((prev) => prev.filter((id) => id !== followingId));
    } catch (err) {
      console.error("Unfollow failed:", err);
    }
  };

  const isNewSender = (current, prev) => {
    return !prev || current.sender?._id !== prev.sender?._id;
  };

  return (
    <div className="container mt-3">
      <h4 className="text-center text-primary">Notifications</h4>

      <div className="d-flex justify-content-end mb-2">
        {!deleteMode ? (
          <button
            className="btn btn-outline-danger btn-sm" style={{width: "100px" }}
            onClick={() => setDeleteMode(true)}
          >
             Delete
          </button>
        ) : (
          <div className="d-flex gap-2">
            <button className="btn btn-success btn-sm" style={{width: "100px" }} onClick={handleDelete} disabled={selectedIds.length === 0}>
               Confirm
            </button>
            <button className="btn btn-secondary btn-sm" style={{width: "100px" }} onClick={() => { setDeleteMode(false); setSelectedIds([]); }}>
               Cancel
            </button>
          </div>
        )}
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {!loading && notifications.length === 0 && !error && (
        <p className="text-center text-muted">No notifications</p>
      )}

      <div className="list-group">
        {notifications.map((n, index) => {
          const prev = notifications[index - 1];
          const showLine = isNewSender(n, prev);
          const senderId = n.sender?._id;
          const isFollowing = followingIds.includes(senderId);

          return (
            <div key={n._id}>
              {index !== 0 && <hr className="my-2" />} {/* This ensures a line before every notification except the first */}
              <div className="d-flex align-items-center justify-content-between py-2">
                <div className="d-flex align-items-center">
                  {deleteMode && (
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={selectedIds.includes(n._id)}
                      onChange={() => handleToggleSelect(n._id)}
                    />
                  )}
                  <img
                    src={n.sender?.profilePic || "https://via.placeholder.com/40"}
                    alt="Profile"
                    className="rounded-circle me-2"
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                  />
                  <div>
                    <strong>{n.sender?.fullName}</strong>:{" "}
                    <span>{n.message || "No message available"}</span>
                  </div>
                </div>

                <div className="ms-2">
                  {isFollowing ? (
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleUnfollow(senderId)}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleFollow(senderId)}
                    >
                      Follow Back
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
