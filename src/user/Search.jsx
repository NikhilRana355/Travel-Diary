import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import defaultAvatar from "../assets/imges/default.png";

const socket = io("http://localhost:3022");

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [following, setFollowing] = useState({});
  const userId = localStorage.getItem("id") || null;
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchUsers();
    fetchFollowing();
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
    });
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
    socket.on("notification", (data) => {
      if (data.recipientId === userId) {
        alert(data.message); // Replace with a better UI notification
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users");
      const filtered = res.data.data.filter(user => user._id !== userId);
      setUsers(filtered.sort((a, b) => a.fullName.localeCompare(b.fullName)));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const res = await axios.get(`/user/following/${userId}`);
      const followedUsers = res.data.following.map(user => user._id);
      setFollowing(followedUsers.reduce((acc, id) => ({ ...acc, [id]: true }), {}));
    } catch (error) {
      console.error("Error fetching following list:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.trim();
    setSearchTerm(value);
    if (!value) {
      setFilteredUsers([]);
      return;
    }
    const filtered = users.filter(user =>
      user.fullName.toLowerCase().includes(value.toLowerCase()) ||
      user.userName.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // const navigate = useNavigate();
  const handleMessage = (receiverId) => {
    navigate(`/user/message/${receiverId}`);
  };
  

  // const handleFollow = async (userIdToFollow) => {
  //   try {
  //     await axios.post("/user/follow", { followerId: userId, followingId: userIdToFollow });
  //     setFollowing((prev) => ({ ...prev, [userIdToFollow]: true }));
  //     socket.emit("followNotification", {
  //       recipientId: userIdToFollow,
  //       senderId: userId,
  //       message: "You have a new follower!"
  //     });
  //   } catch (error) {
  //     console.error("Error following user:", error);
  //   }
  // };

//   const handleFollow = async (userIdToFollow) => {
//     if (!userId) {
//         console.error("Error: logged-in user ID is undefined");
//         return;
//     }

//     try {
//         const response = await axios.post("/notifications", {
//             recipient: userIdToFollow,  // User being followed
//             sender: userId,  // Logged-in user (fixed issue here)
//         });

//         if (response.status === 201) {
//             console.log(`Successfully followed user with ID: ${userIdToFollow}`);
//             console.log(`Notification sent: ${response.data.message}`);
//             alert("Followed successfully! Notification sent.");

//             // Update following state
//             setFollowing((prev) => ({ ...prev, [userIdToFollow]: true }));

//             // Send a real-time notification via Socket.IO
//             socket.emit("followNotification", {
//                 recipientId: userIdToFollow,
//                 senderId: userId,
//                 message: `${userId} started following you!`  // Customize notification message
//             });
//         }
//     } catch (error) {
//         console.error("Error sending follow notification:", error);
//     }
// };

const handleFollow = async (userIdToFollow) => {
  if (!userId) {
      console.error("Error: logged-in user ID is undefined");
      return;
  }

  try {
      // Step 1: Send Follow Request
      const followResponse = await axios.post("/user/follow", {
          followerId: userId,
          followingId: userIdToFollow
      });

      if (followResponse.status === 200) {
          console.log(`Successfully followed user with ID: ${userIdToFollow}`);

          // Update UI
          setFollowing((prev) => ({ ...prev, [userIdToFollow]: true }));

          // Step 2: Send Notification
          const notificationResponse = await axios.post("/notifications/notify", {
              recipient: userIdToFollow,  // Fix field name
              sender: userId,  // Fix field name
              type: "follow"  // Required in backend
          });

          if (notificationResponse.status === 201) {
              console.log("Notification sent successfully:", notificationResponse.data);
              alert("Followed successfully! Notification sent.");
          }
      }
  } catch (error) {
      console.error("Error:", error.response?.data || error.message);
  }
};


  const handleUnfollow = async (userIdToUnfollow) => {
    try {
      await axios.post("/user/unfollow", { followerId: userId, followingId: userIdToUnfollow });
      setFollowing((prev) => {
        const updatedFollowing = { ...prev };
        delete updatedFollowing[userIdToUnfollow];
        return updatedFollowing;
      });
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Search Users</h2>
      <input type="text" className="form-control mb-2" placeholder="Search by name..." value={searchTerm} onChange={handleSearch} />
      <div>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user._id} className="d-flex justify-content-between align-items-center border-bottom py-2">
              <div className="d-flex align-items-center">
                <img src={user.profilePic || defaultAvatar} alt="Profile" className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} />
                <div>
                  <h6 className="mb-0">{user.fullName}</h6>
                  <small className="text-muted">@{user.userName}</small>
                </div>
              </div>
              <div>
              <button className={`btn btn-sm   ${following[user._id] ? 'btn-secondary' : 'btn-primary'}`} style={{width: "80px" }} onClick={() => following[user._id] ? handleUnfollow(user._id) : handleFollow(user._id)}>
                {following[user._id] ? "Unfollow" : "Follow"}
              </button>
              
              <button
                  className="btn btn-sm btn-outline-success" style={{width: "80px" }}
                  onClick={() => handleMessage(user._id, user.fullName)}
                >
                  Message
                </button>
                </div>
            </div>
          ))
        ) : searchTerm ? (
          <p className="text-danger text-center">No users found</p>
        ) : null}
      </div>
    </div>
  );
};
