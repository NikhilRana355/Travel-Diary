import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import defaultAvatar from "../assets/imges/default.png";
import { io } from "socket.io-client"; // ✅ Socket.io client

export const Message = () => {
  const { receiverId } = useParams();
  const currentUserId = localStorage.getItem("id");
  const [followingUsers, setFollowingUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(receiverId || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [incomingMessage, setIncomingMessage] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const socket = io("http://localhost:3022");

  // ✅ Listen for incoming messages
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setIncomingMessage(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ✅ Append incoming message if sender is selected
  useEffect(() => {
    if (incomingMessage) {
      if (incomingMessage.sender === selectedUserId) {
        setMessages((prev) => [...prev, incomingMessage]);
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [incomingMessage.sender]: (prev[incomingMessage.sender] || 0) + 1,
        }));
      }
    }
  }, [incomingMessage, selectedUserId]);

  // ✅ Fetch users you follow
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

  // ✅ Fetch unread counts
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const res = await axios.get(`/message/unread/${currentUserId}`);
        setUnreadCounts(res.data);
      } catch (err) {
        console.error("Failed to fetch unread counts");
      }
    };

    if (currentUserId) fetchUnreadCounts();
  }, [currentUserId]);

  // ✅ Fetch messages when a user is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUserId) return;
      try {
        const res = await axios.get(`/message/message/${currentUserId}/${selectedUserId}`);
        setMessages(res.data);

        // ✅ Mark messages as read
        await axios.post("/message/read", {
          senderId: selectedUserId,
          receiverId: currentUserId,
        });

        // ✅ Clear unread count
        setUnreadCounts((prev) => {
          const updated = { ...prev };
          delete updated[selectedUserId];
          return updated;
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedUserId, currentUserId]);

  // ✅ Send a message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await axios.post("/message/send", {
        senderId: currentUserId,
        receiverId: selectedUserId,
        content: newMessage,
      });
      const sentMessage = res.data;
      setMessages((prev) => [...prev, sentMessage]);
      socket.emit("sendMessage", sentMessage);
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
              onClick={async () => {
                setSelectedUserId(user._id);
                await axios.post("/message/read", {
                  senderId: user._id,
                  receiverId: currentUserId,
                });
                setUnreadCounts((prev) => {
                  const updated = { ...prev };
                  delete updated[user._id];
                  return updated;
                });
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                src={user.profilePic || defaultAvatar}
                alt="profile"
                className="rounded-circle me-2"
                style={{ width: "40px", height: "40px" }}
              />
              <div>
                <strong
                  style={{
                    fontWeight: unreadCounts[user._id] ? "bold" : "normal",
                  }}
                >
                  {user.fullName}
                </strong>
                <br />
                <small className="text-muted">@{user.userName}</small>
              </div>
              {unreadCounts[user._id] && (
                <span className="badge bg-danger ms-auto">{unreadCounts[user._id]}</span>
              )}
            </div>
          ))}
        </div>

        {/* Right side - Messages */}
        <div className="col-md-8 d-flex flex-column justify-content-between">
          <div className="border-bottom p-3 bg-light d-flex align-items-center">
            {selectedUserId && (
              <>
                <img
                  src={
                    followingUsers.find((u) => u._id === selectedUserId)?.profilePic ||
                    defaultAvatar
                  }
                  alt="profile"
                  className="rounded-circle me-2"
                  style={{ width: "40px", height: "40px" }}
                />
                <strong>
                  {followingUsers.find((u) => u._id === selectedUserId)?.fullName}
                </strong>
              </>
            )}
            {!selectedUserId && <strong>Select a chat</strong>}
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
