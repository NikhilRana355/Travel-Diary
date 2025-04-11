import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Slide, toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import defaultAvatar from "../assets/imges/default.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { MyPost } from "../user/MyPost"
 

export const Profile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [originalUsername, setOriginalUsername] = useState("");
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [previewImage, setPreviewImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    fetchUserStats();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:3022/user/${userId}`);
      setUser(response.data.data);
      setOriginalUsername(response.data.data.userName);
      setPreviewImage(null); // Reset preview to force use of actual saved picture
    } catch (error) {
      console.error("Error fetching user profile", error);
      toast.error("Error fetching profile.");
    }
  };

  const fetchUserStats = async () => {
    try {
      if (!userId) return;
      const postsRes = await axios.get(`/diary/getdiarybyuserid/${userId}`);
      const postCount = postsRes.data.data.length;

      const statsRes = await axios.get(`http://localhost:3022/user/stats/${userId}`);
      if (statsRes.status === 200) {
        setStats({
          posts: postCount,
          followers: statsRes.data.followers,
          following: statsRes.data.following
        });
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.put(
        `http://localhost:3022/user/${userId}/uploadProfilePic`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.profilePicture) {
        toast.success("Profile picture updated successfully!");
        await fetchUserProfile();
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      console.error("Upload failed:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.error || "Error uploading image. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      if (user.userName !== originalUsername) {
        const checkResponse = await axios.get(`http://localhost:3022/user/check-username/${user.userName}`);
        if (checkResponse.data.exists) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "This username already exists. Please choose another one.",
          });
          return;
        }
      }

      await axios.put(`http://localhost:3022/user/${userId}`, user);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      setIsEditing(false);
      fetchUserProfile();
    } catch (error) {
      console.error("Error updating profile", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update profile. Please try again.",
      });
    }
  };

  const fetchFollowers = async () => {
    try {
      const response = await axios.get(`http://localhost:3022/user/followers/${userId}`);
      setFollowers(response.data.followers);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const response = await axios.get(`http://localhost:3022/user/following/${userId}`);
      setFollowing(response.data.following);
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  };

  const handleUnfollow = async (userIdToUnfollow) => {
    try {
      const response = await axios.put(`http://localhost:3022/user/unfollow`, {
        followerId: userId,
        followingId: userIdToUnfollow,
      });

      if (response.status === 200) {
        toast.success("Unfollowed successfully!");
        setFollowing((prev) =>
          prev.filter((user) => user._id !== userIdToUnfollow)
        );
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
      toast.error("Failed to unfollow. Please try again.");
    }
  };

  const renderUserList = (list, title, onClose, showUnfollow) => (
    <div
      className="position-fixed bg-white shadow border p-3"
      style={{
        top: "100px",
        right: "20px",
        width: "300px",
        height: "450px",
        zIndex: 1050,
        overflowY: "auto",
      }}
    >
      <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
        <h5 className="mb-0">{title}</h5>
        <button className="btn btn-sm w-25" onClick={onClose}>✖</button>
      </div>

      {list.length === 0 ? (
        <p className="text-muted text-center mt-3">No {title.toLowerCase()} yet.</p>
      ) : (
        list.map((user) => (
          <div
            key={user._id}
            className="d-flex align-items-center justify-content-between py-2 border-bottom"
          >
            <div className="d-flex align-items-center">
              <img
                src={ previewImage || user.profilePic || defaultAvatar}
                alt="avatar"
                className="rounded-circle me-2"
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
              <span className="fw-medium">{user.fullName}</span>
            </div>

            {showUnfollow && (
              <button className="btn btn-outline-danger btn-sm w-25" onClick={() => handleUnfollow(user._id)}>
                Unfollow
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <>
      <div className="container mt-4 text-center">
        <ToastContainer />
        <div>
          <div className="position-relative d-inline-block">
            <label htmlFor="uploadProfilePic" style={{ cursor: "pointer" }}>
              <img
                src={previewImage || user.profilePicture || defaultAvatar}
                alt="Profile Avatar"
                className="rounded-circle border shadow-sm"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </label>
            <input type="file" className="d-none" id="uploadProfilePic" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="mt-3">
            <h5>{user.fullName}</h5>
            <p className="text-muted">@{user.userName}</p>
          </div>

          <button className="btn btn-outline-primary w-auto btn-sm mt-2 px-2 py-1" style={{ fontSize: "15px" }} onClick={() => setIsEditing(true)}>
            ✏️ Edit
          </button>
          {isEditing && (
            <div className="mt-3">
              <input
                type="text"
                className="form-control mb-2"
                name="fullName"
                value={user.fullName || ""}
                onChange={handleInputChange}
              />
              <input
                type="text"
                className="form-control mb-2"
                name="userName"
                value={user.userName || ""}
                onChange={handleInputChange}
              />
              <button className="btn btn-success btn-sm me-2 px-2 py-1" style={{ fontSize: "12px" }} onClick={handleUpdateProfile}>Save</button>
              <button className="btn btn-secondary btn-sm px-2 py-1" style={{ fontSize: "12px" }} onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-center gap-4 mt-3">
          <span><strong>{stats.posts}</strong> Posts</span>
          <span style={{ cursor: "pointer" }} onClick={() => { fetchFollowers(); setShowFollowers(!showFollowers); }}>
            <strong>{stats.followers}</strong> Followers
          </span>
          <span style={{ cursor: "pointer" }} onClick={() => { fetchFollowing(); setShowFollowing(!showFollowing); }}>
            <strong>{stats.following}</strong> Following
          </span>
        </div>

        {showFollowers && renderUserList(followers, "Followers", () => setShowFollowers(false), false)}
        {showFollowing && renderUserList(following, "Following", () => setShowFollowing(false), true)}

        <MyPost posts={posts} />
      </div>
    </>
  );
};
