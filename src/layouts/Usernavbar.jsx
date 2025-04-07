
import React, { useEffect } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Import Bootstrap JS
import { Tooltip } from "bootstrap"; // Import Tooltip from Bootstrap
import hamburgermenu from "../assets/imges/hamburgermenu.png";
import { Link } from "react-router-dom";

export const Usernavbar = ({ toggleSidebar }) => {
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl); // Correct Tooltip Initialization
    });
  }, []);

  return (
    <nav className="app-header navbar navbar-expand bg-body">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link btn btn-light" href="#" role="button" onClick={toggleSidebar} data-bs-toggle="tooltip" title="Toggle Sidebar">
              <img src={hamburgermenu} style={{ height: "25px", width: "25px" }} alt="Menu" />
            </a>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/user" className="nav-link" data-bs-toggle="tooltip" title="Home">
              <i className="nav-icon bi bi-house-door-fill" />
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/user/addDiary" className="nav-link" data-bs-toggle="tooltip" title="Add Diary">
              <i className="nav-icon bi bi-plus-circle"></i>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/user/itinerary" className="nav-link" data-bs-toggle="tooltip" title="Itinerary">
              <i className="nav-icon bi bi-check-square" />
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/user/notification" className="nav-link" data-bs-toggle="tooltip" title="Notification">
              <i className="nav-icon bi bi-bell-fill"></i>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/user/message" className="nav-link" data-bs-toggle="tooltip" title="Messages">
              <i className="nav-icon bi bi-chat-right-text"></i>
            </Link>
          </li>
          {/* <li className="nav-item">
            <Link to="/user/posts" className="nav-link" data-bs-toggle="tooltip" title="Post">
              <i className="nav-icon bi bi-table"></i>
            </Link>
          </li> */}
          <li className="nav-item">
            <Link to="/user/search" className="nav-link" data-bs-toggle="tooltip" title="Search">
              <i className="nav-icon bi bi-search" />
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/user/profile" className="nav-link" data-bs-toggle="tooltip" title="Profile">
              <i className="nav-icon bi bi-person-circle" />
            </Link>
          </li>   
          <li className="nav-item">
            <Link to="/logout" className="nav-link text-danger" data-bs-toggle="tooltip" title="Logout">
              <i className="nav-icon bi bi-box-arrow-right" />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
