import React, { useEffect, useState } from "react";
import "./homepage.css";

import { Eclipse } from "react-loading-io";
import Navbar from '../../components/navbar/Navbar'


const Homepage = () => {
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, []);
  return (
    <div className="containerHomepage">
      {loader ? (
        <div className="containerLoader">
          <Eclipse size={100} speed={1.65} width={3} />
        </div>
      ) : (
        <>
          <div className="itemsTitleHomePage">
            <h1>Anagrafica</h1>
            <p>Crea la tua anagrafica personalizzata</p>
          </div>


          <Navbar />
          
        </>
      )}
    </div>
  );
};

export default Homepage;
