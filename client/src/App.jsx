import Homepage from "./pages/homepage/Homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import RegisterSuccess from "./pages/registerSuccess/RegisterSuccess";
import AuthComponent from "./pages/AuthComponent";
import ProtectedRoutes from "./pages/ProtectedtRoutes";
import HomePageUser from "./pages/userPages/homepageUser/HomePageUser";
import ProfileSuccess from "./pages/profileSuccess/ProfileSuccess";
// import Navbar from "./components/navbar/Navbar";



function App() {
  return (
    <AuthComponent>
      <Router>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-success" element={<RegisterSuccess />} />
            
          <Route element={<ProtectedRoutes />} >

            <Route path='/homepage-user' element={<HomePageUser />} />
            <Route path='/profile-success' element={<ProfileSuccess />} />
          </Route>

        </Routes>

      </Router>
    </AuthComponent>
  );
}

export default App;
