import React, { useState } from "react";
import "../assets/diarypage.css";

export const DiaryPage = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    title: "",
    destination: "",
    travelType: "",
    date: "",
    diary: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [travelPhotos, setTravelPhotos] = useState([]);

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile photo upload
  const handleProfilePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file)); // Show preview
    }
  };

  // Handle travel photos upload
  const handleTravelPhotosUpload = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setTravelPhotos([...travelPhotos, ...newPhotos]);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Data Submitted:", formData);
    console.log("Profile Photo:", profilePhoto);
    console.log("Travel Photos:", travelPhotos);
    alert("Travel Diary Entry Submitted Successfully!");
  };

  return (
    <div className="form">
      <div className="form-container">
        <h2>My Diary</h2>

        {/* Profile Photo Upload */}
        <div className="profile-photo-container">
          <label htmlFor="profile-photo">
            <div className="profile-preview">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" id="profile-img" />
              ) : (
                <i className="fa-solid fa-user default-icon"></i>
              )}
              <div className="edit-icon">
                <i className="fa-solid fa-pencil"></i>
              </div>
            </div>
          </label>
          <input
            type="file"
            id="profile-photo"
            accept="image/*"
            onChange={handleProfilePhotoUpload}
            style={{ display: "none" }}
          />
        </div>

        {/* Travel Diary Form */}
        <form onSubmit={handleSubmit}>
          {/* User Details */}
          <label>Your Name* :</label>
          <input type="text" placeholder="Enter your name" name="name" value={formData.name} onChange={handleChange} required />

          <label>Contact Number* :</label>
          <input type="tel" placeholder="Enter your contact" name="contact" value={formData.contact} onChange={handleChange} required />

          {/* Trip Details */}
          <label>Trip Title* :</label>
          <input type="text" placeholder="Enter your tital (eg. Family Adventure in Disneyland, Desert Safari: A Thrill in Dubai) " name="title" value={formData.title} onChange={handleChange} required />

          <label>Destination* :</label>
          <input type="text" placeholder="Enter your trip Destination (eg. Bali, Indonesia)" name="destination" value={formData.destination} onChange={handleChange} required />

          <label>Travel Type* :</label>
          <select name="travelType" value={formData.travelType} onChange={handleChange} required>
            <option value="">Select Travel Type</option>
            <option value="Adventure">Adventure</option>
            <option value="Relaxation">Relaxation</option>
            {/* <option value="Honeymoon">Honeymoon</option> */}
            <option value="Business">Business</option>
            <option value="Family">Family</option>
            <option value="Solo">Solo</option>
          </select>

          <label>Travel Date* :</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />

          <label>Your Travel Story* :</label>
          <textarea name="diary" placeholder="Enter Your Story" value={formData.diary} onChange={handleChange} rows={5} required />

          {/* Travel Photos Upload */}
          <label>Upload Travel Photos:</label>
          <input type="file" multiple accept="image/*" onChange={handleTravelPhotosUpload} />

          {/* Display uploaded travel photos */}
          <div className="photo-preview">
            {travelPhotos.map((photo, index) => (
              <img key={index} src={photo} alt={`Travel ${index}`} className="travel-img" />
            ))}
          </div>

          <button type="submit" className="submit-btn">
            Submit Entry
          </button>
        </form>
      </div>
    </div>
  );
};
