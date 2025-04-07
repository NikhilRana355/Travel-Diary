import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import defaultAvatar from "../assets/imges/default.png";

export const Message = () => {
  const { receiverId } = useParams();
  const currentUserId = localStorage.getItem("id");
  const [followingUsers, setFollowingUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(receiverId || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch users you follow
  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await axios.get(`/user/following/${currentUserId}`);
        setFollowingUsers(res.data.following);
      } catch (error) {
        console.error("Error fetching following users:", error);
      }
    };
    fetchFollowing();
  }, [currentUserId]);

  // Fetch messages when a user is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUserId) return;
      try {
        const res = await axios.get(`/message/message/${currentUserId}/${selectedUserId}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedUserId, currentUserId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await axios.post("/message/send", {
        senderId: currentUserId,
        receiverId: selectedUserId,
        content: newMessage,
      });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row border rounded" style={{ height: "85vh" }}>
        {/* Left side - User List */}
        <div className="col-md-4 border-end overflow-auto">
          <h5 className="p-3">Messages</h5>
          {followingUsers.map((user) => (
            <div
              key={user._id}
              className={`d-flex align-items-center p-2 cursor-pointer ${selectedUserId === user._id ? "bg-light" : ""
                }`}
              onClick={() => setSelectedUserId(user._id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={user.profilePicture || defaultAvatar}
                alt="profile"
                className="rounded-circle me-2"
                style={{ width: "40px", height: "40px" }}
              />
              <div>
                <div>{user.fullName}</div>
                <small className="text-muted">@{user.userName}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Right side - Messages */}
        <div className="col-md-8 d-flex flex-column justify-content-between">
          <div className="border-bottom p-3 bg-light">
            <strong>
              {followingUsers.find((u) => u._id === selectedUserId)?.fullName || "Select a chat"}
            </strong>
          </div>
          <div className="flex-grow-1 overflow-auto p-3">
            {messages.length > 0 ? (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`d-flex mb-2 ${msg.sender === currentUserId ? "justify-content-end" : "justify-content-start"
                    }`}
                >
                  <div
                    className={`p-2 rounded ${msg.sender === currentUserId
                      ? "bg-primary text-white"
                      : "bg-light text-dark"
                      }`}
                    style={{ maxWidth: "75%" }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted text-center">No messages yet</div>
            )}
          </div>

          <div className="p-2 border-top bg-light">
            <div
              className="d-flex align-items-center px-2 py-1"
              style={{
                border: "1px solid #ddd",
                borderRadius: "30px",
                backgroundColor: "#f8f9fa",
                height: "40px",
              }}
            >
              <input
                type="text"
                className="form-control border-0 bg-transparent shadow-none p-1"
                style={{
                  fontSize: "14px",
                  height: "30px",
                }}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
              />
              <i
                className="bi bi-send-fill text-primary fs-5 ms-2"
                style={{ cursor: "pointer" }}
                onClick={sendMessage}
              ></i>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};
