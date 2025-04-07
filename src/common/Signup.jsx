import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../assets/signup.css";
import axios from "axios";
import GradientText from "../common/GradientText";


export const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      // Check if username exists
      const usernameCheck = await axios.get(`/user/check-username/${data.userName}`);
      if (usernameCheck.data && usernameCheck.data.exists) {
        Swal.fire({
          title: "Username Taken",
          text: "This username is already taken, please choose another.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      // Proceed with signup
      data.roleId = "67d0212630fc0b0b8a748d23";
      const res = await axios.post("/user", data);

      if (res.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Signup Successfully!!!",
          icon: "success",
          confirmButtonText: "OK",
          timer: 2000,
        });
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Signup Failed! Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    
    <div className="signup-container">
      <div className="signup-box">
        <GradientText text="Travel Diary" />
        <p className="subtitle">Sign up to see photos and travel stories from your friends.</p>
        <button className="facebook-signup">Sign up with Facebook</button>
        <p className="or-divider">OR</p>
        <form onSubmit={handleSubmit(submitHandler)}>
          <input type="text" placeholder="Full Name" {...register("fullName", { required: "Full Name is required" })} />
          {errors.fullName && <span className="error">{errors.fullName.message}</span>}

          <input type="text" placeholder="Username" {...register("userName", { required: "Username is required" })} />
          {errors.userName && <span className="error">{errors.userName.message}</span>}

          <input type="email" placeholder="Email" {...register("email", { required: "Email is required" })} />
          {errors.email && <span className="error">{errors.email.message}</span>}

          <input type="password" placeholder="Password" {...register("password", { required: "Password is required" })} />
          {errors.password && <span className="error">{errors.password.message}</span>}

          <button type="submit">Sign up</button>
        </form>
        <p className="terms">By signing up, you agree to our Terms, Privacy Policy, and Cookies Policy.</p>
        <div className="login-link">
          <p>Have an account? <a href="/login">Log in</a></p>
        </div>
      </div>
    </div>
   
  );
};

export default Signup;
