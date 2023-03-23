import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../pages/AuthComponent";
import NavbarUtente from "../navbarUtente/NavbarUtente";

const Navbar = () => {
const {isAuth} = useAuth();

  if(isAuth) {
    return(
      <>
        <NavbarUtente />
      </>
    )
  }

  return (
    <div className="btnScelta">
      <Link to="/login">
        <button className="btnLoginTo">Login</button>
      </Link>

      <p>or</p>
      <Link to="/register">
        <button className="btnRegisterTo">Register</button>
      </Link>
    </div>
  );
};

export default Navbar;
