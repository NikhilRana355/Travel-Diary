import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`/posts/${id}`)
      .then(response => setPost(response.data))
      .catch(error => console.error("Error fetching post details:", error));
  }, [id]);

  if (!post) return <h2 className="text-center">Loading...</h2>;

  return (
    <div className="container">
      <h2 className="my-4">{post.title}</h2>
      <p><strong>Posted by:</strong> {post.userId?.name || "Unknown"}</p>
      {post.imageUrl && <img src={post.imageUrl} className="img-fluid mb-3" alt="Post" />}
      <p>{post.description}</p>
    </div>
  );
};
