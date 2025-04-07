import React, { useState } from 'react'


export const ItineraryPlanning = () => {
  const [formData, setFormData] = useState({
    tripName: "",
    destination: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center bg-light">
    <div className="container p-5">
      <h2 className="text-center mb-4">Plan Your Itinerary</h2>
      <form onSubmit={handleSubmit} >
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Trip Name</label>
            <input
              type="text"
              className="form-control"
              name="tripName"
              value={formData.tripName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Destination</label>
            <input
              type="text"
              className="form-control"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea
            className="form-control"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary w-100 py-2">
          Save Itinerary
        </button>
      </form>
    </div>
  </div>
  )
}

