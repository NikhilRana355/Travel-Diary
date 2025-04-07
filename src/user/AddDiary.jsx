import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const AddDiary = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    getAllCountries();
  }, []);

  const getAllCountries = async () => {
    try {
      const res = await axios.get("/country/getCountry");
      setCountries(res.data.data);
    } catch (error) {
      console.error("Error fetching countries:", error.message);
    }
  };

  const getStatesByCountryId = async (id) => {
    try {
      const res = await axios.get(`/state/getstatebycountry/${id}`);
      setStates(res.data.data);
      setCities([]);
    } catch (error) {
      console.error("Error fetching states:", error.message);
    }
  };

  const getCitiesByStateId = async (id) => {
    try {
      const res = await axios.get(`/city/getcitybystateid/${id}`);
      setCities(res.data.data);
    } catch (error) {
      console.error("Error fetching cities:", error.message);
    }
  };

  const submitHandler = async (data) => {
    try {
      const userId = localStorage.getItem("id");
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("title", data.title);
      formData.append("country", data.country);
      formData.append("stateId", data.stateId);
      formData.append("cityId", data.cityId);
      formData.append("description", data.description);
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);
      formData.append("image", data.image[0]);

      await axios.post("/diary/addWithFile", formData);
      reset();
      alert("Diary Created Successfully!");
    } catch (error) {
      console.error("Error saving diary:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 ">
      <div className="max-wd-max mx-auto  p-4">
        <h2 className="text-center text-primary mb-4">
          <i className="bi bi-journal-plus me-2"></i> Create Your New Travel Diary
        </h2>
        
        <form onSubmit={handleSubmit(submitHandler)} encType="multipart/form-data">
          {/* Journal Title */}
          <div className="mb-3">
            <label className="form-label w-100">Journal Title:</label>
            <input
              type="text"
              className="form-control w-100"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <p className="text-danger">{errors.title.message}</p>}
          </div>
          

          {/* Country Select */}
          <div className="mb-3">
            <label className="form-label">Select Country:</label>
            <select
              className="form-select"
              {...register("country", { required: "Country is required" })}
              onChange={(e) => getStatesByCountryId(e.target.value)}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country._id} value={country._id}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && <p className="text-danger">{errors.country.message}</p>}
          </div>

          {/* State Select */}
          <div className="mb-3">
            <label className="form-label">Select State:</label>
            <select
              className="form-select"
              {...register("stateId", { required: "State is required" })}
              onChange={(e) => getCitiesByStateId(e.target.value)}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.stateId && <p className="text-danger">{errors.stateId.message}</p>}
          </div>

          {/* City Select */}
          <div className="mb-3">
            <label className="form-label">Select City:</label>
            <select
              className="form-select"
              {...register("cityId", { required: "City is required" })}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.cityId && <p className="text-danger">{errors.cityId.message}</p>}
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description:</label>
            <textarea
              rows="4"
              className="form-control"
              {...register("description", { required: "Description is required" })}
            ></textarea>
            {errors.description && <p className="text-danger">{errors.description.message}</p>}
          </div>

          {/* Start Date */}
          <div className="mb-3">
            <label className="form-label">Start Date:</label>
            <input
              type="date"
              className="form-control"
              {...register("startDate", { required: "Start Date is required" })}
              onChange={(e) => setStartDate(e.target.value)}
            />
            {errors.startDate && <p className="text-danger">{errors.startDate.message}</p>}
          </div>

          {/* End Date */}
          <div className="mb-3">
            <label className="form-label">End Date:</label>
            <input
              type="date"
              className="form-control"
              {...register("endDate", { required: "End Date is required" })}
              min={startDate}
            />
            {errors.endDate && <p className="text-danger">{errors.endDate.message}</p>}
          </div>

          {/* Upload Image */}
          <div className="mb-3">
            <label className="form-label">Upload Image:</label>
            <input
              type="file"
              className="form-control"
              {...register("image", { required: "Image is required" })}
            />
            {errors.image && <p className="text-danger">{errors.image.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            <i className="bi bi-plus-circle me-2"></i> Create Diary
          </button>
        </form>
      </div>
    </div>
  );
};
