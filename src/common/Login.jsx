import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../assets/login.css";
import axios from "axios";

import GradientText from "../common/GradientText";

export const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/user/login", data);
      console.log(res.data);

      if (res.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Login Successfully!!!",
          icon: "success",
          confirmButtonText: "OK",
          timer: 2000,
        });

        localStorage.setItem("id", res.data.data._id);
        localStorage.setItem("role", res.data.data.roleId.name);
        localStorage.setItem("user", JSON.stringify(res.data.data));

        setTimeout(() => {
          if (res.data.data.roleId.name === "User") {
            navigate("/user");
          }
        }, 2000);
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Login Failed!!",
        icon: "error",

        showConfirmButton: false,
      });
    }
  };

  return (
   
    <div style={{ textAlign: "center" }}>
      <div className="login-container">
        <div className="login-box">
          <GradientText text="Travel Diary" />
          <form onSubmit={handleSubmit(submitHandler)}>
            <input
              type="email"
              placeholder="Email or Username"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <span className="error">{errors.email.message}</span>}

            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <span className="error">{errors.password.message}</span>}

            <button type="submit">Log in</button>
          </form>
          <div className="social-login">
            <p>OR</p>
            <button className="facebook-login">Log in with Facebook</button>
          </div>
          <p><a href="/forgotpassword">Forgot password?</a></p>
          <div className="signup-link">
            <p>Don't have an account? <a href="/signup">Sign up</a></p>
          </div>
        </div>
      </div>
    </div>
   
  );
};

export default Login;
