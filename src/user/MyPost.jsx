import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ItineraryPlanning } from '../user/ItineraryPlanning'; // ✅ default import

export const MyPost = () => {
    const [screens, setScreens] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [locations, setLocations] = useState({});
    const [showItinerary, setShowItinerary] = useState(false);

    useEffect(() => {
        const getAllMyScreens = async () => {
            try {
                const res = await axios.get("/diary/getdiarybyuserid/" + localStorage.getItem("id"));
                setScreens(res.data.data);
                fetchLocations(res.data.data);
            } catch (error) {
                console.error("Error fetching posts", error);
            }
        };
        getAllMyScreens();
    }, []);

    const fetchLocations = async (posts) => {
        let locationData = {};
        for (let post of posts) {
            if (post.countryid && post.stateid && post.cityid) {
                try {
                    const countryRes = await axios.get(`/api/country/${post.countryid}`);
                    const stateRes = await axios.get(`/api/state/${post.stateid}`);
                    const cityRes = await axios.get(`/api/city/${post.cityid}`);

                    locationData[post._id] = {
                        country: countryRes.data?.name || "Unknown Country",
                        state: stateRes.data?.name || "Unknown State",
                        city: cityRes.data?.name || "Unknown City",
                    };
                } catch (error) {
                    console.error("Error fetching location details", error);
                }
            }
        }
        setLocations(locationData);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4"></h2>
            <div className="row g-4">
                {screens?.map((sc) => (
                    <div key={sc._id} className="col-md-4">
                        <div
                            className="card shadow-sm"
                            onClick={() => setSelectedPost(sc)}
                            style={{ cursor: "pointer" }}
                        >
                            <img
                                src={sc.imageURL}
                                className="card-img-top"
                                alt={sc.title}
                                style={{ height: "250px", width: "100%", objectFit: "cover" }}
                            />
                            <div className="card-body text-center">
                                <h5 className="card-title">{sc.title}</h5>
                                <p className="text-muted mb-0" style={{ textAlign: "right" }}>
                                    {new Date(sc.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Full Post Modal */}
            {selectedPost && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-white" style={{ zIndex: 1050 }}>
                    <button
                        className="btn-close position-absolute"
                        onClick={() => setSelectedPost(null)}
                        aria-label="Close"
                        style={{ top: "15px", right: "15px", zIndex: 1060 }}
                    ></button>

                    <div className="d-flex flex-column flex-md-row h-100">
                        {/* Left image */}
                        <div className="d-flex justify-content-center align-items-center w-100 w-md-50 p-4 border-end">
                            <img
                                src={selectedPost.imageURL}
                                alt="Post"
                                className="rounded shadow"
                                style={{
                                    maxHeight: "90vh",
                                    width: "100%",
                                    maxWidth: "600px",
                                    objectFit: "cover",
                                }}
                            />
                        </div>

                        {/* Right Details */}
                        <div className="d-flex justify-content-center align-items-center w-100 w-md-50 p-4 overflow-auto">
                            <div>
                                <h3 className="text-center">{selectedPost.title}</h3>
                                <p><strong>Description:</strong> {selectedPost.description}</p>
                                <p><strong>Location:</strong> {locations[selectedPost._id]?.city}, {locations[selectedPost._id]?.state}, {locations[selectedPost._id]?.country}</p>
                                <p><strong>Category:</strong> {selectedPost.category || "N/A"}</p>
                                <p><strong>Weather:</strong> {selectedPost.weather || "N/A"}</p>
                                <p><strong>Tags:</strong> {selectedPost.tags?.join(", ") || "N/A"}</p>
                                <p className="text-muted"><strong>Posted on:</strong> {new Date(selectedPost.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Itinerary Button - Bootstrap styled */}
                    <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: 1060 }}>
                        <button
                            className="btn btn-primary d-flex align-items-center"
                            onClick={() => setShowItinerary(true)}
                        >
                            <i className="bi bi-map-fill me-2"></i>
                            Create Your Itinerary
                        </button>
                    </div>
                </div>
            )}

            {/* Itinerary Modal */}
            {showItinerary && (
  <div className="position-fixed top-0 start-0 w-100 h-100 bg-white" style={{ zIndex: 1060, overflowY: "auto" }}>
    <button
      className="btn-close position-absolute"
      onClick={() => setShowItinerary(false)}
      aria-label="Close"
      style={{ top: "15px", right: "15px", zIndex: 1070 }}
    ></button>
    <div className="p-4">
      <ItineraryPlanning />
    </div>
  </div>
)}

            
        </div>
    );
};
