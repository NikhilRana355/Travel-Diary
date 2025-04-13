// import { useEffect, useState } from "react"
// import { Navigate, Outlet } from "react-router-dom";

// const useAuth = () => {
//     const[authState, setAuthState] = useState({ isLoggedin: false, role: ""});
//     const[loading, setLoading] = useState(true);

//     useEffect(() => {
//         const id = localStorage.getItem("id");
//         const role = localStorage.getItem("role");

//         if(id){
//             setAuthState({isLoggedin:true, role});
//         }
//         setLoading(false);
//     }, []);

//     return{...authState, loading};
// };

// const PrivateRoutes = () => {
//     const auth = useAuth();

//     if(auth.loading) {
//         return <h1>Loading....</h1>;
//     }

//     return auth.isLoggedin ? <Outlet/> : <Navigate to ="/login"/>;

// };
// export default PrivateRoutes;

import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const [authState, setAuthState] = useState({ isLoggedin: false, role: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("id");
    const role = localStorage.getItem("role");

    if (id && role) {
      setAuthState({ isLoggedin: true, role: role.toLowerCase() });
    }

    setLoading(false);
  }, []);

  return { ...authState, loading };
};

const PrivateRoutes = ({ allowedRoles = ["user", "admin"] }) => {
  const auth = useAuth();

  if (auth.loading) {
    return <h1>Loading...</h1>;
  }

  if (!auth.isLoggedin) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(auth.role)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
