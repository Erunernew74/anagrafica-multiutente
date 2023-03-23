import React, { useState } from "react";
import "./formNumeriTelefono.css";
import { FcDeleteDatabase } from 'react-icons/fc'

const FormNumeriTelefono = ({ elem, i, handleChange, deleteField }) => {
  return (
    <div className="containerFormNumeriTel">
      <select
        name="tipologiaNumero"
        value={elem.tipologiaNumero}
        onChange={(e) => handleChange(e, i)}
        id="selectTipologisNumero"
      >
        <option value="scegli">---Tipologia Numero---</option>
        <option value="Cellulare Privato">Cellulare privato</option>
        <option value="Cellulare Aziendale">Cellulare aziendale</option>
        <option value="Fisso Casa">Fisso di casa</option>
        <option value="Fisso Aziendale">Fisso aziendale</option>
        <option value="Altro">Altro</option>
      </select>

      <input
        type="text"
        name="numeroTelefono"
        value={elem.numeroTelefono}
        onChange={(e) => handleChange(e, i)}
        id="inputNumeroTelefono"
      />

      {/* <input type="button" onClick={()=> deleteField(i)} value="X" className="btnDeleteField"/> */}
      <FcDeleteDatabase onClick={()=> deleteField(i)} className="btnDeleteField" />
    </div>
  );
};

export default FormNumeriTelefono;
