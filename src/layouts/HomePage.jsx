import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const [showComments, setShowComments] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/diary/getAllDiary");
        setPosts(res.data.data);

        const likeStatuses = {};
        for (const post of res.data.data) {
          try {
            const response = await axios.get(`/like/getLikeStatus/${post._id}`, {
              params: { userId },
            });
            likeStatuses[post._id] = {
              liked: response.data.liked,
              count: response.data.count,
            };
          } catch {
            likeStatuses[post._id] = { liked: false, count: 0 };
          }
        }

        setLikes(likeStatuses);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    };

    fetchPosts();
  }, [userId]);

  const toggleLike = async (diaryId) => {
    if (!userId) {
      alert("Please log in to like posts.");
      return;
    }

    try {
      const res = await axios.put(`/like/toggleLike/${diaryId}`, { userId });
      const newStatus = res.data.liked;

      setLikes((prev) => {
        const prevLikeData = prev[diaryId] || { liked: false, count: 0 };
        return {
          ...prev,
          [diaryId]: {
            liked: newStatus,
            count: prevLikeData.count + (newStatus ? 1 : -1),
          },
        };
      });
    } catch (err) {
      console.error("Like error", err);
    }
  };

  const fetchComments = async (diaryId) => {
    try {
      const res = await axios.get(`/comments/${diaryId}`);
      setComments((prev) => ({ ...prev, [diaryId]: res.data }));
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const submitComment = async (diaryId) => {
    if (!userId) {
      alert("Please log in to comment.");
      return;
    }

    try {
      await axios.post("/comments", {
        diaryId,
        userId,
        content: newComment[diaryId] || "",
      });

      setNewComment((prev) => ({ ...prev, [diaryId]: "" }));
      fetchComments(diaryId); // Refresh comments
    } catch (err) {
      console.error("Failed to submit comment", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        {posts.map((post) => (
          <div key={post._id} className="col-md-6">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
              {/* Header */}
              <div className="card-header d-flex align-items-center bg-white border-0 p-3">
                <img
                  src={post.userId?.profilePic || "/default-avatar.png"}
                  alt="Profile"
                  className="rounded-circle me-3"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
                <div>
                  <h6 className="mb-0 fw-bold">{post.userId?.fullName || "User"}</h6>
                  <small>@{post.userId?.userName || "username"}</small>
                </div>
              </div>

              {/* Image */}
              {post.imageURL && (
                <img
                  src={post.imageURL}
                  alt={post.title}
                  className="card-img-top"
                  style={{ height: "350px", objectFit: "cover" }}
                />
              )}

              {/* Body */}
              <div className="card-body p-4">
                <h5 className="card-title fw-bold">{post.title}</h5>
                <p className="card-text text-muted">{post.description}</p>
                <p className="text-muted">
                  📍 {post.city?.name || "City"}, {post.state?.name || "State"},{" "}
                  {post.country?.name || "Country"}
                </p>
              </div>

              {/* Footer */}
              <div className="card-footer d-flex justify-content-between align-items-center bg-white border-0 p-3">
                <div className="d-flex align-items-center">
                  <i
                    className={`bi ${
                      likes[post._id]?.liked ? "bi-heart-fill text-danger" : "bi-heart"
                    } fs-5 me-2`}
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleLike(post._id)}
                  ></i>
                  <span className="me-3">{likes[post._id]?.count ?? 0} likes</span>

                  {/* Comment Icon */}
                  <i
                    className="bi bi-chat-left fs-5"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setShowComments((prev) => ({
                        ...prev,
                        [post._id]: !prev[post._id],
                      }));
                      if (!showComments[post._id]) fetchComments(post._id);
                    }}
                  ></i>
                </div>
                {/* Removed timestamp */}
              </div>

              {/* Comment Section */}
              {showComments[post._id] && (
                <div className="px-4 pb-4">
                  {/* Comments List */}
                  {comments[post._id]?.map((c) => (
                    <div key={c._id} className="d-flex align-items-start mb-3">
                      <img
                        src={c.userId?.profilePic || "/default-avatar.png"}
                        alt="Avatar"
                        className="rounded-circle me-3"
                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                      />
                      <div
                        className="bg-light p-3 rounded-4"
                        style={{ maxWidth: "100%", width: "100%" }}
                      >
                        <div className="fw-semibold">
                          {c.userId?.fullName || "User"}{" "}
                          <small className="text-muted">@{c.userId?.userName}</small>
                        </div>
                        <div className="text-muted" style={{ fontSize: "0.95rem" }}>
                          {c.content}
                        </div>
                        <div className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>
                          {new Date(c.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Comment */}
                  <div className="d-flex mt-3 align-items-center">
                    <input
                      type="text"
                      className="form-control rounded-pill me-2"
                      placeholder="Add a comment..."
                      value={newComment[post._id] || ""}
                      onChange={(e) =>
                        setNewComment((prev) => ({
                          ...prev,
                          [post._id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="btn btn-outline-primary rounded-pill px-4" style={{width: "80px" }}
                      onClick={() => submitComment(post._id)}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
