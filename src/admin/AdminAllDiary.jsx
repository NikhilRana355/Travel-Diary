import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

export const AdminAllDiary = () => {
    const [posts, setPosts] = useState([]);

    const fetchAllDiaries = async () => {
      try {
        const res = await axios.get("/diary/getAllDiary");
        setPosts(res.data.data);
      } catch (err) {
        console.error("Failed to fetch diaries", err);
      }
    };
  
    useEffect(() => {
      fetchAllDiaries();
    }, []);
  
    const deletePost = async (postId) => {
      const confirm = window.confirm("Are you sure you want to delete this diary?");
      if (!confirm) return;
  
      try {
        await axios.delete(`/diary/deleteDiary/${postId}`);
        setPosts((prev) => prev.filter((post) => post._id !== postId));
      } catch (err) {
        console.error("Failed to delete post", err);
        alert("Error deleting diary. Please try again.");
      }
    };    
  
    return (
      <div className="container mt-4">
        <h2 className="mb-4 fw-bold text-center">All Diaries (Admin View)</h2>
        <div className="row justify-content-center">
          {posts.map((post) => (
            <div key={post._id} className="col-md-6">
              <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
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
                    📍 {post.cityId?.name || "City"}, {post.stateId?.name || "State"},{" "}
                    {post.country?.name || "Country"}
                  </p>
                  <p className="text-muted">
                    🗓️ {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
  
                <div className="card-footer d-flex justify-content-end bg-white border-0 p-3">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => deletePost(post._id)}
                  >
                    <i className="bi bi-trash me-1"></i> Delete Diary
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };