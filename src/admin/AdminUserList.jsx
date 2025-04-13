import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // ✅ SweetAlert2 import

const BACKEND_URL = "http://localhost:3022";

export const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [stats, setStats] = useState({ diariesList: [] });

    useEffect(() => {
        axios.get(`${BACKEND_URL}/users`)
            .then((res) => setUsers(res.data.data || []))
            .catch((err) => console.error("Fetch error:", err.message));
    }, []);

    const openUserDetails = async (userId) => {
        try {
            const userRes = await axios.get(`${BACKEND_URL}/user/${userId}`);
            const user = userRes.data.data || userRes.data;

            let diaries = [];
            try {
                const diaryRes = await axios.get(`${BACKEND_URL}/diary/user/${userId}`);
                diaries = diaryRes.data || [];
            } catch (err) {
                console.warn("No diaries found");
            }

            setSelectedUser(user);
            setStats({ diariesList: diaries });
        } catch (err) {
            console.error("Error loading user:", err.message);
        }
    };

    const deleteDiary = async (diaryId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${BACKEND_URL}/diary/${diaryId}`);
                    setStats(prevStats => ({
                        ...prevStats,
                        diariesList: prevStats.diariesList.filter(diary => diary._id !== diaryId),
                    }));

                    Swal.fire(
                        'Deleted!',
                        'The diary has been deleted.',
                        'success'
                    );
                } catch (err) {
                    console.error("Error deleting diary:", err.message);
                    Swal.fire(
                        'Error!',
                        'Something went wrong while deleting.',
                        'error'
                    );
                }
            }
        });
    };

    return (
        <div style={{ padding: "2rem", position: "relative" }}>
            {!selectedUser ? (
                <>
                    <h2>All Users</h2>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        {users.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => openUserDetails(user._id)}
                                style={{
                                    background: "#fff",
                                    padding: "1rem",
                                    borderRadius: "10px",
                                    width: "220px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                    cursor: "pointer",
                                }}
                            >
                                <img
                                    src={user.profilePic}
                                    alt={user.fullName}
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        marginBottom: "10px",
                                    }}
                                />
                                <h5>{user.fullName}</h5>
                                <p>@{user.userName}</p>

                                <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                                    {user.posts?.slice(0, 3).map((post) => (
                                        <img
                                            key={post._id}
                                            src={post.imageURL}
                                            alt={post.title}
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                borderRadius: "8px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "#fff",
                        zIndex: 999,
                        overflowY: "auto",
                        padding: "2rem",
                    }}
                >
                    <button
                        onClick={() => setSelectedUser(null)}
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "transparent",
                            fontSize: "24px",
                            border: "none",
                            cursor: "pointer",
                        }}
                        title="Close"
                    >
                        &times;
                    </button>

                    <h3>User Details</h3>
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                        <img
                            src={selectedUser.profilePicture || selectedUser.profilePic}
                            alt={selectedUser.fullName}
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                marginBottom: "1rem"
                            }}
                        />
                        <h3>{selectedUser.fullName}</h3>
                        <p><strong>Username:</strong> @{selectedUser.userName}</p>
                        <p><strong>Email:</strong> {selectedUser.email || "Not provided"}</p>
                    </div>

                    <h4>📝 Diaries</h4>
                    {stats.diariesList.length > 0 ? (
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>View</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.diariesList.map(diary => (
                                    <tr key={diary._id}>
                                        <td>
                                            <img
                                                src={diary.imageURL || diary.coverImage || diary.image}
                                                alt={diary.title}
                                                style={{
                                                    width: "60px",
                                                    height: "60px",
                                                    borderRadius: "6px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </td>
                                        <td>{diary.title}</td>
                                        <td>
                                            <button
                                                onClick={() => console.log("View diary:", diary)}
                                                style={{
                                                    background: "#3498db",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "6px 10px",
                                                    borderRadius: "4px",
                                                    width: "80px",
                                                }}>
                                                View
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => deleteDiary(diary._id)}
                                                style={{
                                                    background: "#e74c3c",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "6px 10px",
                                                    borderRadius: "4px",
                                                    width: "80px",
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No diaries found.</p>
                    )}
                </div>
            )}
        </div>
    );
};
