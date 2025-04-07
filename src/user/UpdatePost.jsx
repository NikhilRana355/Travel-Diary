import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

export const UpdatePost = () => {

  const id = useParams().id
  const [countries, setCountry] = useState([]);
  const [states, setState] = useState([]);
  const [cities, setCity] = useState([]);

  const getAllCountry = async () => {
    const res = await axios.get("/country/getCountry");
    console.log(res.data);
    setCountry(res.data.data);
  };

  const getStateByCountryId = async (id) => {
    const res = await axios.get("/state/getstatebycountry/" + id);
    setState(res.data.data)
  };

  const getCityByStateId = async (id) => {
    const res = await axios.get("/city/getcitybystateid/" + id);
    setCity(res.data.data)
  };

  useEffect(() => {
    getAllCountry();
  }, []);


  const { register, handleSubmit, formState: { errors } } = useForm({
  // console.log(data);
  defaultValues:async()=>{
    const res = await axios.get("/userdiary/getUSerDiaryById/"+id)
    return res.data.data
    } 
  });



  const submitHandler = async (data) => {
    data.userId = localStorage.getItem("id");
    //console.log(data);
    delete data._id; //put _id -->
    console.log(data);
    const res = await axios.put("/userdiary/updateUserDiary/"+id, data);
      console.log(res.data)

    // const formData = new FormData();
    // formData.append("userId", data.userId);
    // formData.append("title", data.title);
    // formData.append("country", data.country);
    // formData.append("stateId", data.stateId);
    // formData.append("cityId", data.cityId);
    // formData.append("description",data.description)
    // formData.append("startDate", data.startDate);
    // formData.append("endDate", data.endDate);
    // formData.append("image", data.image[0]);

    // try {


    //   const res = await axios.post("/userdiary/addWithFile", formData);
    //   console.log("formdata....", res.data);
    // } catch (error) {
    //   console.error("Error saving data:", error.response?.data || error.message);
    // }
  };
  return (
    <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-lg p-4">
          <h2 className="text-center mb-4">Create Your Travel Diary</h2>

          <form onSubmit={handleSubmit(submitHandler)} encType='multipart/form-data'>
            {/* Journal Title */}
            <div className="mb-3">
              <label className="form-label">Journal Title:</label>
              <input
                type="text"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                {...register("title", { required: "Journal Title is required" })}
                placeholder="Enter journal title"
              />

            </div>

            {/* Country */}
            <div className="mb-3">
              <label className="form-label"> Select Country:</label>
              <select
                className='form-control' {...register("country")}
                onChange={(event) => getStateByCountryId(event.target.value)}>
                <option value="">SELECT COUNTRY:</option>
                {countries?.map((country) => (
                  <option value={country._id}>{country.name}</option>
                ))}
              </select>
              {/* {errors.country && <div className="invalid-feedback">{errors.country.message}</div>} */}
            </div>

            {/* State */}
            <div className='mb-3'>
              <lable className="from-control"> Select State:</lable>
              <select className='from-select' {...register("stateId")}
                onChange={(event) => getCityByStateId(event.target.value)}>
                <option>SELECT STATE</option>
                {states?.map((state) => (
                  <option value={state._id}>{state.name}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className='mb-3'>
              <lable className="from-control"> Select City:</lable>
              <select className='from-select' {...register("cityId")}>
                {/* onChange={(event) => getCityByStateId(event.target.value)}> */}
                <option>SELECT CITY</option>
                {cities?.map((city) => (
                  <option value={city._id}>{city.name}</option>
                ))}
              </select>
            </div>

            {/* description */}

            <div className="mb-3">
              <label className="form-label">Description*</label>
              <textarea className="form-control" rows="4" {...register("description", { required: true })}></textarea>
              {errors.description && <p className="error-text">Description is required.</p>}
            </div>






            {/* Start Date */}
            <div className="mb-3">
              <label className="form-label">Start Date:</label>
              <input
                type="date"
                className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                {...register("startDate", { required: "Start Date is required" })}
              />
              {/* {errors.startDate && <div className="invalid-feedback">{errors.startDate.message}</div>} */}
            </div>

            {/* End Date */}
            <div className="mb-3">
              <label className="form-label">End Date:</label>
              <input
                type="date"
                className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                {...register("endDate", { required: "End Date is required" })}
              />
              {/* {errors.endDate && <div className="invalid-feedback">{errors.endDate.message}</div>} */}
            </div>

            {/* Upload Image */}
            <div className="mb-3">
              <label className="form-label">Upload Image:</label>
              <input
                type="file"
                className={`form-control ${errors.image ? "is-invalid" : ""}`}
                {...register("image", { required: "Image upload is required" })}
              />
              {errors.image && <div className="invalid-feedback">{errors.image.message}</div>}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100">
              Update My Diary
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  )
}
