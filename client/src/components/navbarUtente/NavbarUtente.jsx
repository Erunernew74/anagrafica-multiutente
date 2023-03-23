import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../pages/AuthComponent";
import './navbarUtente.css'

const NavbarUtente = () => {
  const { setIsAuth, setUserData, isAuth } = useAuth();
  const removeJwt = async () => {
    await fetch(`http://localhost:8000/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setIsAuth(false);
    setUserData({});
  };


  return (
    <div className="divNavbarUtente">
      <Link to='/'>
        <input onClick={removeJwt} value='LOGOUT' type='button' className="btnNavbarUtente"/>
      </Link>
    </div>
  );
};

export default NavbarUtente;
