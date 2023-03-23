import React, { useEffect, useState } from "react";
import "./login.css";
import { Link, Navigate } from "react-router-dom";
import { Eclipse } from "react-loading-io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../AuthComponent";

const Login = () => {
  const [msgError, setMsgError] = useState("");
  const { isAuth, setIsAuth, setUserData, userData } = useAuth();
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, []);

  const [inputs, setInputs] = useState({
    usernameUtente: "",
    password: "",
  });

  const { usernameUtente, password } = inputs;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usernameUtente === "" || password === "") {
      return toast("ATTENZIONE! Inserire tutti i campi", {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "toast-message",
      });
  }
    const res = await fetch(`http://localhost:8000/auth/login`, {
      method:'POST',
      credentials:'include',
      headers:{
        "Content-type":"application/json"
      },
      body: JSON.stringify({
        usernameUtente,
        password
      })
    })
    const data = await res.json();
    console.log(data)
    setIsAuth(res.ok)
    if(res.ok){
      return setUserData(data.user)
    }else {
      return setMsgError(
        toast(data.msg, {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "toast-message",
        })
      );
    }
  }

  if (isAuth) return <Navigate to="/homepage-user" />;

  return (
    <div className="containerLogin">
      {loader ? (
        <div className="containerLoader">
          <Eclipse size={100} speed={1.65} width={3} />
        </div>
      ) : (
        <>
          <div className="loginForm">
            <div className="btnHomePage">
              <Link to="/">
                <button>Home page</button>
              </Link>
            </div>
            <h1>Login page</h1>
            <form className="containerForm" onSubmit={handleSubmit}>
              <div className="itemsFormLogin">
                <label htmlFor="">Username</label>
                <input
                  type="text"
                  name="usernameUtente"
                  value={usernameUtente}
                  onChange={handleChange}
                  placeholder="Your username"
                />
              </div>
              <div className="itemsFormLogin">
                <label htmlFor="">Password</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Your Password"
                />
              </div>
              <div className="btnLogin">
                <button>Login</button>
                <p>
                  Non sei ancora registrato? Clicca{" "}
                  <Link to="/register">qui</Link>
                </p>
              </div>
              <ToastContainer />
            </form>
          </div>
          <div className="containerImage"></div>
        </>
      )}
    </div>
  );
};

export default Login;
