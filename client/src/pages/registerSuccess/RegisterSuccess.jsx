import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./registerSuccess.css";
import { Eclipse } from "react-loading-io";

const RegisterSuccess = () => {
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, []);
  return (
    <div className="containerRegisterSuccess">
      {loader ? (
        <div className="containerLoader">
          <Eclipse size={100} speed={1.65} width={3} />
        </div>
      ) : (
        <>
          <div className="itemsRegisterSuccess">
            <h1>Registrazione avvenuta con successo</h1>
            <div className="btnRender">
              <Link to="/login">
                <button className="btnRenderRegisterSuccess">LOGIN</button>
              </Link>
              <Link to="/">
                <button
                  className="btnRenderRegisterSuccess"
                  id="btnHmeRenderRegisterSuccess"
                >
                  HOME PAGE
                </button>
              </Link>
            </div>
          </div>
          <div className="itemImageRegisterSuccess"></div>
        </>
      )}
    </div>
  );
};

export default RegisterSuccess;
