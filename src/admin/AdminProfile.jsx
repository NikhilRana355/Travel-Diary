import React, { useEffect, useState } from 'react'
import axios from "axios";

export const AdminProfile = () => {

    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);

    // const adminId = localStorage.getItem("userId"); 

    const adminId = "67f8988383c00ffecabcf0d5"

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                console.log("Fetching admin profile from backend...");
                const response = await axios.get(`/user/${adminId}`);
                console.log("Response:", response.data);
                setAdminData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching admin profile:", error);
                setLoading(false);
            }
        };


        if (adminId) {
            fetchAdminProfile();
        }
    }, [adminId]);

    if (loading) return <p className="p-6 text-gray-500">Loading admin profile...</p>;

    if (!adminData) return <p className="p-6 text-red-500">Failed to load admin profile.</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6"></h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow-md p-6 rounded-xl text-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mx-auto shadow-md">
                        <img
                            src={adminData.profilePicture || "/default"}
                            alt="admin"
                            className="rounded-circle border shadow-sm"
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{adminData.fullName}</h3>
                    <p className="text-gray-500">@{adminData.userName}</p>
                    <p className="mt-2 text-blue-600 font-semibold">Role: Admin</p>
                </div>

                {/* Placeholder stats (replace with real values if available) */}
                {/* <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow">
                        <h4 className="text-md font-semibold">Users Managed</h4>
                        <p className="text-2xl font-bold">---</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow">
                        <h4 className="text-md font-semibold">Diaries Approved</h4>
                        <p className="text-2xl font-bold">---</p>
                    </div>
                    <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow">
                        <h4 className="text-md font-semibold">Reports Handled</h4>
                        <p className="text-2xl font-bold">---</p>
                    </div>
                    <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow">
                        <h4 className="text-md font-semibold">Itineraries Reviewed</h4>
                        <p className="text-2xl font-bold">---</p>
                    </div>
                </div> */}
            </div>
        </div>
    )
}
