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
        localStorage.setItem("role", res.data.data.roleId.name.toLowerCase());
        localStorage.setItem("user", JSON.stringify(res.data.data));

        setTimeout(() => {
        //   if (res.data.data.roleId.name === "User") {
        //     navigate("/user");
        //   }
        // }, 2000);

        const role = res.data.data.roleId.name;

        if (role === "User") {
          navigate("/user");
        } else if (role === "Admin") {
          navigate("/");
        } else {
          console.warn("Unknown role:", role);
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


// import React, { useState } from "react";
// import axios from "axios";
// // import swal from "sweetalert";
// import { useNavigate } from "react-router-dom";
// import GradientText from "../common/GradientText"; // Assuming you're using this
// import "../assets/login.css"; // Assuming your CSS is here
// import Swal from "sweetalert2";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("/user/login", {
//         email,
//         password,
//       });

//       Swal("Success", "Login successful!", "success");

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("roleId", res.data.roleId);
//       localStorage.setItem("userId", res.data.userId);
//       localStorage.setItem("username", res.data.username);

//       // ✅ Role-based redirection logic
//       const roleId = res.data.roleId;
//       if (roleId === "67d0211330fc0b0b8a748d21") {
//         navigate("/admin");
//       } else if (roleId === "67d0212630fc0b0b8a748d23") {
//         navigate("/user");
//       } else {
//         Swal("Error", "Unknown role. Contact support.", "error");
//       }
//     } catch (err) {
//       Swal("Error", err.response?.data?.message || "Login failed", "error");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <GradientText text="Welcome Back!" className="login-title" />
//         <form onSubmit={handleLogin}>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <button type="submit" className="login-button">
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
