import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/diary/getAllDiary");
        setPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const handleLikeToggle = async (postId) => {
    try {
      const res = await axios.put(`/user/toggleLike/${postId}`, { userId });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: res.data.likedByUser
                  ? [...post.likes, userId]
                  : post.likes.filter((id) => id !== userId),
              }
            : post
        )
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return <h4 className="text-center mt-5 text-muted">No posts available.</h4>;
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        {posts.map((post) => {
          const likedByUser = post.likes?.includes(userId);

          return (
            <div key={post._id} className="col-md-6">
              <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-4">
                <div className="card-header d-flex align-items-center bg-white border-0 p-3">
                  <img
                    src={post.userId?.profilePic || "/default-avatar.png"}
                    alt="Profile"
                    className="rounded-circle me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <h6 className="mb-0 fw-bold">
                      {post.userId?.fullName || "User"}
                    </h6>
                    <small className="text-muted">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>

                {post.imageURL && (
                  <img
                    src={post.imageURL}
                    alt={post.title}
                    className="card-img-top"
                    style={{ height: "350px", objectFit: "cover" }}
                  />
                )}

                <div className="card-body p-4">
                  <h5 className="card-title fw-bold">{post.title}</h5>
                  <p className="card-text text-muted">{post.description}</p>
                  <p className="text-muted">
                    📍 {post.city?.name || "City"},{" "}
                    {post.state?.name || "State"},{" "}
                    {post.country?.name || "Country"}
                  </p>
                </div>

                <div className="card-footer d-flex justify-content-between bg-white border-0 p-3">
                  <div>
                    <button
                      className={`btn btn-sm me-2 ${
                        likedByUser ? "text-danger" : "text-secondary"
                      }`}
                      onClick={() => handleLikeToggle(post._id)}
                    >
                      <i
                        className={`bi ${
                          likedByUser ? "bi-heart-fill" : "bi-heart"
                        }`}
                      ></i>{" "}
                      {post.likes?.length || 0}
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
                      💬 Comment
                    </button>
                  </div>
                  <small className="text-muted">
                    {new Date(post.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
