import React from "react";
import "./formEmail.css";
import { FcDeleteDatabase } from "react-icons/fc";

const FormEmail = ({ elem, i, handleChange, deleteField }) => {
  return (
    <div className="containerFormEmail">
      <select
        name="tipologiaEmail"
        value={elem.tipologiaEmail}
        onChange={(e) => handleChange(e, i)}
        className="inputEmail"
        id="selectEmail"
      >
        <option value="scegli">---Tipologia Email---</option>
        <option value="Email Privata">Email privata</option>
        <option value="Email Aziendale">Email aziendale</option>
        <option value="Altro">Altro</option>
      </select>

      <input
        type="text"
        name="email"
        value={elem.email}
        onChange={(e) => handleChange(e, i)}
        className="inputEmail"
        id="inputEmail"
      />
      <FcDeleteDatabase
        onClick={() => deleteField(i)}
        className="btnDeleteField"
      />
    </div>
  );
};

export default FormEmail;
