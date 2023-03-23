import React, { useEffect, useState } from "react";
import "./register.css";
import { Eclipse } from "react-loading-io";
import { Link, Navigate } from "react-router-dom";
import { FcHome } from "react-icons/fc";
import ImageUpload from "../../components/imageUpload/ImageUpload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, []);

  //* Rendering condizionale
  const [nav, setNav] = useState(false);
  const [msgError, setMsgError] = useState("")
  const [validImage, setValidImage] = useState(false);
  const [file, setFile] = useState();
  const [state, setState] = useState({
    nomeUtente:"",
    usernameUtente:"",
    password:"",
    passwordVerify:""
  })
  const { nomeUtente, usernameUtente, password, passwordVerify } = state;

  const handleChange = e => {
    const { name, value } = e.target;
    setState({...state, [name]: value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!validImage) return alert(`L'immagina inserita non è valida o è assente`)

    const data = new FormData();
    data.append("nomeUtente", nomeUtente);
    data.append("usernameUtente", usernameUtente);
    data.append("password", password);
    data.append("passwordVerify", passwordVerify);
    data.append("image", file)

    const res = await fetch(`http://localhost:8000/auth/register`, {
      method:'POST',
      credentials:'include',
      body: data,
      mode:"cors"
    })
    const ris = await res.json();
    console.log(ris)
    if(res.ok){
      setNav(ris)
    }else{
      return setMsgError(
        toast(ris.msg, {
          position: toast.POSITION.BOTTOM_RIGHT,
        className: "toast-message",
        })
      )
    }
  }

  if(nav) return <Navigate to='/register-success' />

  return (
    <div className="containerRegister">
      {loader ? (
        <div className="containerLoader">
          <Eclipse size={100} speed={1.65} width={3} />
        </div>
      ) : (
        <>
          <div className="registerForm">
            <Link to="/" className="linkHomeRegister">
              <button className="btnHomeRegister">
                <div>
                  <FcHome id='iconHomePage'/>
                </div>
                <div className="textBtnHomeRegister">HOME PAGE</div>
              </button>
            </Link>
            <h1>Register page</h1>
            <form 
              className="containerFormRegister"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              >
              <div className="itemsRegister">
                {/* <label htmlFor="">First name</label> */}
                <input 
                  type="text" 
                  name='nomeUtente'
                  value={nomeUtente}
                  onChange={handleChange}
                  placeholder="Your first name" />
              </div>
              <div className="itemsRegister">
                {/* <label htmlFor="">Username</label> */}
                <input 
                  type="text" 
                  name='usernameUtente'
                  value={usernameUtente}
                  onChange={handleChange}
                  placeholder="Your username" />
              </div>
              <div className="imageDiv">
                <ImageUpload 
                  setValidImage={setValidImage}
                  file={file}
                  setFile={setFile}
                />
              </div>
              <div className="itemsRegister">
                {/* <label htmlFor="">Password</label> */}
                <input 
                  type="password" 
                  name='password'
                  value={password}
                  onChange={handleChange}
                  placeholder="Your password" />
              </div>
              <div className="itemsRegister">
                {/* <label htmlFor="">Confirm Password</label> */}
                <input 
                  type="password" 
                  name='passwordVerify'
                  value={passwordVerify}
                  onChange={handleChange}
                  placeholder="Confirm password" />
              </div>
              <div className="containerBtnRegister">
                <button>Register</button>
              </div>
              <ToastContainer />
            </form>
          </div>
          <div className="containerImageRegister"></div>
        </>
      )}
    </div>
  );
};

export default Register;
