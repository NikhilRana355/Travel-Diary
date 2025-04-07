import React from "react";
import "../assets/css/gradienttext.css";

const GradientText = ({ text, className = "" }) => {
  return (
    <h1 className={`gradient-text ${className}`}>
      {text}
    </h1>
  );
};

export default GradientText;