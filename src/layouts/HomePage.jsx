// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";

// export const HomePage = () => {
//   const [posts, setPosts] = useState([]);
//   const [likes, setLikes] = useState({});
//   const [showComments, setShowComments] = useState({});
//   const [comments, setComments] = useState({});
//   const [newComment, setNewComment] = useState({});

//   const user = JSON.parse(localStorage.getItem("user"));
//   const userId = user?._id;

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const res = await axios.get("/diary/getAllDiary");
//         setPosts(res.data.data);

//         const likeStatuses = {};
//         for (const post of res.data.data) {
//           try {
//             const response = await axios.get(`/like/getLikeStatus/${post._id}`, {
//               params: { userId },
//             });
//             likeStatuses[post._id] = {
//               liked: response.data.liked,
//               count: response.data.count,
//             };
//           } catch {
//             likeStatuses[post._id] = { liked: false, count: 0 };
//           }
//         }

//         setLikes(likeStatuses);
//       } catch (err) {
//         console.error("Failed to fetch posts", err);
//       }
//     };

//     fetchPosts();
//   }, [userId]);

//   const toggleLike = async (diaryId) => {
//     if (!userId) {
//       alert("Please log in to like posts.");
//       return;
//     }

//     try {
//       const res = await axios.put(`/like/toggleLike/${diaryId}`, { userId });
//       const newStatus = res.data.liked;

//       setLikes((prev) => {
//         const prevLikeData = prev[diaryId] || { liked: false, count: 0 };
//         return {
//           ...prev,
//           [diaryId]: {
//             liked: newStatus,
//             count: prevLikeData.count + (newStatus ? 1 : -1),
//           },
//         };
//       });
//     } catch (err) {
//       console.error("Like error", err);
//     }
//   };

//   const fetchComments = async (diaryId) => {
//     try {
//       const res = await axios.get(`/comments/${diaryId}`);
//       setComments((prev) => ({ ...prev, [diaryId]: res.data }));
//     } catch (err) {
//       console.error("Failed to fetch comments", err);
//     }
//   };

//   const submitComment = async (diaryId) => {
//     if (!userId) {
//       alert("Please log in to comment.");
//       return;
//     }

//     try {
//       await axios.post("/comments", {
//         diaryId,
//         userId,
//         content: newComment[diaryId] || "",
//       });

//       setNewComment((prev) => ({ ...prev, [diaryId]: "" }));
//       fetchComments(diaryId); // Refresh comments
//     } catch (err) {
//       console.error("Failed to submit comment", err);
//     }
//   }

//   return (
//     <div className="container mt-4">
//       <div className="row justify-content-center">
//         {posts.map((post) => (
//           <div key={post._id} className="col-md-6">
//             <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
//               {/* Header */}
//               <div className="card-header d-flex align-items-center bg-white border-0 p-3">
//                 <img
//                   src={post.userId?.profilePic || "/default-avatar.png"}
//                   alt="Profile"
//                   className="rounded-circle me-3"
//                   style={{ width: "50px", height: "50px", objectFit: "cover" }}
//                 />
//                 <div>
//                   <h6 className="mb-0 fw-bold">{post.userId?.fullName || "User"}</h6>
//                   <small>@{post.userId?.userName || "username"}</small>
//                 </div>
//               </div>

//               {/* Image */}
//               {post.imageURL && (
//                 <img
//                   src={post.imageURL}
//                   alt={post.title}
//                   className="card-img-top"
//                   style={{ height: "350px", objectFit: "cover" }}
//                 />
//               )}

//               {/* Body */}
//               <div className="card-body p-4">
//                 <h5 className="card-title fw-bold">{post.title}</h5>
//                 <p className="card-text text-muted">{post.description}</p>
//                 <p className="text-muted">
//                   📍 {post.city?.name || "City"}, {post.state?.name || "State"},{" "}
//                   {post.country?.name || "Country"}
//                 </p>
//               </div>

//               {/* Footer */}
//               <div className="card-footer d-flex justify-content-between align-items-center bg-white border-0 p-3">
//                 <div className="d-flex align-items-center">
//                   <i
//                     className={`bi ${likes[post._id]?.liked ? "bi-heart-fill text-danger" : "bi-heart"
//                       } fs-5 me-2`}
//                     style={{ cursor: "pointer" }}
//                     onClick={() => toggleLike(post._id)}
//                   ></i>
//                   <span className="me-3">{likes[post._id]?.count ?? 0} likes</span>

//                   {/* Comment Icon */}
//                   <i
//                     className="bi bi-chat-left fs-5"
//                     style={{ cursor: "pointer" }}
//                     onClick={() => {
//                       setShowComments((prev) => ({
//                         ...prev,
//                         [post._id]: !prev[post._id],
//                       }));
//                       if (!showComments[post._id]) fetchComments(post._id);
//                     }}
//                   ></i>
//                 </div>
//                 {/* Removed timestamp */}
//               </div>

//               {/* Comment Section */}
//               {showComments[post._id] && (
//                 <div className="px-4 pb-4">
//                   {/* Comments List */}
//                   {comments[post._id]?.map((c) => (
//                     <div key={c._id} className="d-flex align-items-start mb-3">
//                       <img
//                         src={c.userId?.profilePic || "/default-avatar.png"}
//                         alt="Avatar"
//                         className="rounded-circle me-3"
//                         style={{ width: "40px", height: "40px", objectFit: "cover" }}
//                       />

//                       <div
//                         className="bg-light p-3 rounded-4"
//                         style={{ maxWidth: "100%", width: "100%" }}
//                       >
//                         <div className="fw-semibold">
//                           {c.userId?.fullName || "User"}{" "}
//                           <small className="text-muted">@{c.userId?.userName}</small>
//                         </div>
//                         <div className="text-muted" style={{ fontSize: "0.95rem" }}>
//                           {c.content}
//                         </div>
//                         <div className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>
//                           {new Date(c.createdAt).toLocaleString()}
//                         </div>
//                       </div>
//                     </div>
//                   ))}

//                   {/* Add Comment */}
//                   <div className="d-flex mt-3 align-items-center">
//                     <input
//                       type="text"
//                       className="form-control rounded-pill me-2"
//                       placeholder="Add a comment..."
//                       value={newComment[post._id] || ""}
//                       onChange={(e) =>
//                         setNewComment((prev) => ({
//                           ...prev,
//                           [post._id]: e.target.value,
//                         }))
//                       }
//                     />
//                     <button
//                       className="btn btn-outline-primary rounded-pill px-4" style={{ width: "80px" }}
//                       onClick={() => submitComment(post._id)}
//                     >
//                       Post
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


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
  const [selectedPost, setSelectedPost] = useState(null);

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
      fetchComments(diaryId);
    } catch (err) {
      console.error("Failed to submit comment", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        {posts.map((post) => (
          <div
            key={post._id}
            className="col-md-6"
            onClick={() => {
              setSelectedPost(post);
              fetchComments(post._id);
            }}
            style={{ cursor: "pointer" }}
          >
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
                  📍 {post.cityId?.name || "City"}, {post.stateId?.name || "State"}, {post.countryId?.name || "Country"}
                </p>
              </div>

              <div className="card-footer d-flex justify-content-between align-items-center bg-white border-0 p-3">
                <div className="d-flex align-items-center">
                  <i
                    className={`bi ${likes[post._id]?.liked ? "bi-heart-fill text-danger" : "bi-heart"} fs-5 me-2`}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(post._id);
                    }}
                  ></i>
                  <span className="me-3">{likes[post._id]?.count ?? 0} likes</span>

                  <i
                    className="bi bi-chat-left-text fs-5"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowComments((prev) => ({
                        ...prev,
                        [post._id]: !prev[post._id],
                      }));
                      if (!showComments[post._id]) fetchComments(post._id);
                    }}
                  ></i>
                </div>
              </div>

              {showComments[post._id] && (
                <div className="px-4 pb-4">
                  {comments[post._id]?.map((c) => (
                    <div key={c._id} className="d-flex align-items-start mb-3">
                      <img
                        src={c.userId?.profilePic || "/default-avatar.png"}
                        alt="Avatar"
                        className="rounded-circle me-3"
                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                      />
                      <div className="bg-light p-3 rounded-4" style={{ width: "100%" }}>
                        <div className="fw-semibold">
                          {c.userId?.fullName || "User"}{" "}
                          <small className="text-muted">@{c.userId?.userName}</small>
                        </div>
                        <div className="text-muted">{c.content}</div>
                        <div className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>
                          {new Date(c.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}

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
                      className="btn btn-outline-primary rounded-pill px-4"
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

      {/* 🔍 Full-screen Modal */}
      {selectedPost && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-white" style={{ zIndex: 1050 }}>
          <button
            className="btn-close position-absolute"
            onClick={() => setSelectedPost(null)}
            aria-label="Close"
            style={{ top: "15px", right: "15px", zIndex: 1060 }}
          ></button>

          <div className="d-flex flex-column flex-md-row h-100">
            {/* Left: Image */}
            <div className="d-flex justify-content-center align-items-center w-100 w-md-5 p-4 border-end">
              <img
                src={selectedPost.imageURL}
                alt="Diary"
                className="rounded shadow"
                style={{ maxHeight: "90vh", width: "100%", maxWidth: "600px", objectFit: "cover" }}
              />
            </div>

            {/* Middle: Details */}
            <div className="d-flex justify-content-center align-items-start flex-column w-100 w-md-5 p-4 overflow-auto">
              <h3 className="mb-3">{selectedPost.title}</h3>
              <p>{selectedPost.description}</p>
              <p>
                <strong>Location:</strong>{" "}
                {selectedPost.cityId?.name}, {selectedPost.stateId?.name}, {selectedPost.countryId?.name}
              </p>
              <p className="text-muted">
                <strong>Posted on:</strong>{" "}
                {new Date(selectedPost.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Right: Comments + Likes */}
            <div
              className="d-flex flex-column w-100 w-md-2 p-4 border-start"
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              <div className="mb-3 d-flex align-items-center">
                <i
                  className={`bi ${likes[selectedPost._id]?.liked ? "bi-heart-fill text-danger" : "bi-heart"} fs-4 me-3`}
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleLike(selectedPost._id)}
                ></i>
                <span className="me-4">{likes[selectedPost._id]?.count ?? 0} likes</span>

                <i
                  className="bi bi-chat-left-text fs-4 me-2"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setShowComments((prev) => ({
                      ...prev,
                      [selectedPost._id]: !prev[selectedPost._id],
                    }))
                  }
                ></i>
                <span>{comments[selectedPost._id]?.length ?? 0} comments</span>
              </div>

              {/* Comments Section in Modal */}
              {showComments[selectedPost._id] && (
                <>
                  <h6 className="fw-bold mt-3">Comments</h6>
                  {comments[selectedPost._id]?.map((c) => (
                    <div key={c._id} className="mb-3">
                      <div className="fw-semibold">{c.userId?.fullName}</div>
                      <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                        {c.content}
                      </div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                        {new Date(c.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}

                  <div className="d-flex mt-3">
                    <input
                      type="text"
                      className="form-control me-2"
                      placeholder="Add a comment..."
                      value={newComment[selectedPost._id] || ""}
                      onChange={(e) =>
                        setNewComment((prev) => ({
                          ...prev,
                          [selectedPost._id]: e.target.value,
                        }))
                      }
                    />
                    <button className="btn btn-primary" onClick={() => submitComment(selectedPost._id)}>
                      Post
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
