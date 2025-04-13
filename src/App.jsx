import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { Usersidebar } from './layouts/Usersidebar';
import "../src/assets/adminlte.css";
import "../src/assets/adminlte.min.css";
import Signup from './common/Signup';
import Login from './common/Login';
import axios from 'axios';
import { AddDiary } from './user/AddDiary';
// import { DiaryPage } from './common/DiaryPage';
import PrivateRoutes from './hooks/ParivateRoutes';
import { MyPost } from './user/MyPost';
import { UpdatePost } from './user/UpdatePost';
import { ItineraryPlanning } from './user/ItineraryPlanning';
import { Profile } from './user/Profile';
import { Search } from './user/Search';
import { HomePage } from './layouts/HomePage';
import { PostDetails } from './layouts/PostDetail';
import { ResetPassword } from './common/ResetPassword';
import { ForgotPassword } from './common/ForgotPassword';
import "./App.css"
import { Message } from './user/Message';
import { Notification } from './common/Notification';
import { AdminNavbar } from './layouts/AdminNavbar';
import { AdminSidebar } from './layouts/AdminSidebar';
import { AdminHome } from './admin/AdminHome';

axios.defaults.baseURL = "http://localhost:3022";

function App() {
  const userId = localStorage.getItem("userId");
  // const location = useLocation();

  // useEffect(() => {
  //   if (location.pathname === "/login" || location.pathname === "/signup") {
  //     document.body.className = "";
  //   } else {
  //     document.body.className =
  //       "layout-fixed sidebar-expand-lg bg-body-tertiary sidebar-open app-loaded";
  //   }
  // }, [location.pathname]);

  return (
    <div className="app-wrapper app-main">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/forgotpassword' element={<ForgotPassword />}></Route>
        <Route path="/resetpassword/:token" element={<ResetPassword />}></Route>
        {/* <Route index element={<HomePage/>}></Route> */}

        <Route element={<PrivateRoutes allowedRoles={["user","admin"]} />}>
          {/* <Route path="/" element={<Usersidebar />} />
          <Route path='/' element={<Navigate to='/user' />}></Route> */}
          <Route path="/post/:id" element={<PostDetails />}></Route>
          <Route path='/user' element={<Usersidebar />}>

            <Route index element={<HomePage />}></Route>
            <Route path='addDiary' element={<AddDiary />} />
            <Route path='posts' element={<MyPost />} />
            <Route path='update/:id' element={<UpdatePost />} />
            <Route path='itinerary' element={<ItineraryPlanning />} />
            <Route path='profile' element={<Profile />} /> ✅ Profile should be here
            <Route path='profile/:id' element={<Profile />} /> ✅ Profile should be here
            <Route path='search' element={<Search />} />
            <Route path='message' element={<Message />} />
            <Route path='message/:id' element={<Message />} />
            <Route path="message/:receiverId" element={<Message />} />
            <Route path='notification' element={<Notification />}></Route>
          </Route>
          {/* <Route path="profile" element={<Navigate to={`/user/profile/${userId}`} />} /> */}
        </Route>

        <Route element={<PrivateRoutes allowedRoles={["admin"]}/>}>
           <Route path='/' element={<AdminSidebar/>}></Route>
          {/* <Route path='/' element={<Navigate to='/admin'/>}></Route> */} 
          <Route path='/admin' element={<AdminSidebar/>}>
              <Route  path='adminhome' index element={<AdminHome/>}></Route>
          </Route>

        </Route>

      </Routes>
    </div>
  );
}

export default App;
