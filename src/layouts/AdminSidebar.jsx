import React, { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AdminNavbar } from "./AdminNavbar";

export const AdminSidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    console.log("toggleSidebar");
    setSidebarOpen(!isSidebarOpen);
  };

  const navigate = useNavigate();

  const handleLogout =() => {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <>
      <div className="app-wrapper">
        <AdminNavbar toggleSidebar={toggleSidebar} />
        <aside
          className={`app-sidebar bg-body-secondary shadow ${isSidebarOpen ? "open" : "d-none"
            }`}
          data-bs-theme="light"
        >
          <div className="sidebar-brand">
            <Link to="/user/home" className="brand-link">
              <div className="brand-text  text-uppercase">Travel Diary</div>
            </Link>
          </div>

          <div className="sidebar-menu-container">
            <nav className="mt-2">
              <ul className="nav sidebar-menu flex-column" role="menu">
                <li className="nav-item">
                  <Link to="/user" className="nav-link">
                    <i className="nav-icon bi bi-house-door" />
                    <p>Home</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/user/addDiary" className="nav-link">
                    <i class=" nav-icon bi bi-plus-circle"></i>
                    <p>Add Diary</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/user/itinerary" className="nav-link">
                    <i className="nav-icon bi bi-check-square" />
                    <p>Itinerary</p>
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link to="/user/posts" className="nav-link">
                    <i className="nav-icon bi bi-table"></i>
                    <p>
                      Post
                    </p>
                  </Link>
                </li> */}
                <li className="nav-item">
                  <Link to="/user/message" className="nav-link">
                    <i className="nav-icon bi bi-chat-dots" />
                    <p>
                      Messages
                    </p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/user/profile" className="nav-link">
                    <i className="nav-icon bi bi-person-circle" />
                    <p>Profile</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-danger" onClick={handleLogout}>
                    <i className="nav-icon bi bi-box-arrow-right" />
                    <p>Logout</p>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
        <main class="app-main">
          <Outlet></Outlet>
        </main>
      </div>
    </>
  );
};
