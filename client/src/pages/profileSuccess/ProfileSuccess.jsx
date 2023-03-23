import React from "react";
import { Link } from "react-router-dom";
import "./profileSuccess.css";

const ProfileSuccess = () => {
  return (
    <div className="containerProfileSuccess">
      <div className="containerItemsProfileSuccess">
        <p>Profilo cambiato correttamente</p>
        <Link to="/homepage-user">
          <button className="btnProfileSuccess">PROFILO</button>{" "}
        </Link>
      </div>
      <div className="containerImageProfileSuccess"></div>
    </div>
  );
};

export default ProfileSuccess;
