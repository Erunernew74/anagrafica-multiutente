import React, { useState, useEffect } from "react";
import NavbarUtente from "../../../components/navbarUtente/NavbarUtente";
import { useAuth } from "../../AuthComponent";
import "./homePageUser.css";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { BsSun, BsSunFill } from "react-icons/bs";
import { BiAddToQueue } from "react-icons/bi";
import ImageUploadUpdate from "../../../components/imageUploadUpdate/ImageUploadUpdate";
import FormNumeriTelefono from "../../../components/formNumeriTelefono/FormNumeriTelefono";
import FormEmail from "../../../components/formEmail/FormEmail";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { RiDeleteBin5Line } from "react-icons/ri";

const HomePageUser = () => {
  const { userData, setUserData } = useAuth();

  const [nav, setNav] = useState(false);

  const [ext, setExt] = useState(userData.ext);
  const [idUtente, setIdUtente] = useState(userData._id);
  const [nomeUtente, setNomeUtente] = useState(userData.nomeUtente);
  const [cognomeUtente, setCognomeUtente] = useState(userData.cognomeUtente);
  const [usernameUtente, setUsernameUtente] = useState(userData.usernameUtente);
  const [immagine, setImmagine] = useState("");
  const [validImage, setValidImage] = useState(false);
  const [file, setFile] = useState();

  //* State per il form numeri di telefono
  const [numeriTelefono, setNumeriTelefono] = useState([
    { tipologiaNumero: "", numeroTelefono: "" },
  ]);
  //* Funzine per aggiungere un numnero di telefono
  const addNumeriTelefonoForm = (e) => {
    e.preventDefault();
    setNumeriTelefono([
      ...numeriTelefono,
      { tipologiaNumero: "", numeroTelefono: "" },
    ]);
  };
  //* onChange del formNumeritelefono
  const changeNumeriTelefono = (e, i) => {
    const { value, name } = e.target;
    const newNumeri = [...numeriTelefono];
    newNumeri[i][name] = value;
    setNumeriTelefono(newNumeri);
  };

  

  //* State per il form email
  const [email, setEmail] = useState([{ tipologiaEmail: "", email: "" }]);
  //* Funzione per aggiungere una email:
  const addEmail = (e) => {
    e.preventDefault();
    setEmail([...email, { tipologiaEmail: "", email: "" }]);
  };
  //* onChange per il form Email
  const changeEmail = (e, i) => {
    e.preventDefault();
    const { value, name } = e.target;
    const newEmail = [...email];
    newEmail[i][name] = value;
    setEmail(newEmail);
  };

  //* Settaggio degli state per vedere i numeri di telefono e le email al caricamento della pagina
  const [myNumbers, setMyNumbers] = useState([]);
  const [myEmails, setMyEmails] = useState([]);
  useEffect(() => {
    getNumbers();
    getEmail();
  }, []);

  //* Funzione useEffect per vedere tutti i numeri di telefono al caricamento della pagina
  const getNumbers = async () => {
    const resNumeri = await fetch(`http://localhost:8000/numeri/get-numeri`, {
      credentials: "include",
    });
    const { data } = await resNumeri.json();

    setMyNumbers(data);
    console.log(data);
  };

  //* Funzione per vedere tutte le email
  const getEmail = async () => {
    const resEmail = await fetch(`http://localhost:8000/email/get-email`, {
      credentials: "include",
    });
    const { data } = await resEmail.json();
    console.log(data);
    setMyEmails(data);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const dataUpdate = new FormData();
    dataUpdate.append("nomeUtente", nomeUtente);
    dataUpdate.append("cognomeUtente", cognomeUtente);
    dataUpdate.append("usernameUtente", usernameUtente);
    //* Essendo numeriTelefono un array(tabella esterna) dobbiamo trasformarlo con stringify
    //* Nel backend andremo a ritrasformarlo tramite il parse
    dataUpdate.append("numeriTelefono", JSON.stringify(numeriTelefono));
    dataUpdate.append("email", JSON.stringify(email));
    dataUpdate.append("oldImage", immagine);
    dataUpdate.append("image", file);
    const res = await fetch(`http://localhost:8000/auth/update-profile`, {
      method: "PUT",
      credentials: "include",

      body: dataUpdate,
    });
    const data = await res.json();
    console.log(data);

    if (res.ok) {
      //* Setto i cookie e li trasformo in un oggetto javascript
      Cookies.set("user", JSON.stringify(data.userUpdate));
      //* Setto lo stato degli userData così al nuovo caricamento dei dati avrò tutto aggiornato con i dati salvati
      setUserData(data.userUpdate);
      setNav(data);
    } else {
      return alert(data.msg);
    }
  };

  const deleteNumero = async (numeroId) => {
    const resDeleteNumero = await fetch(
      `http://localhost:8000/numeri/delete/${numeroId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    const data = await resDeleteNumero.json();
    setNav(data);
    if (resDeleteNumero.ok) {
      setMyNumbers((myNumbers) => {
        myNumbers.filter((numero) => numero._id !== numeroId);
      });
    }
  };

  

  const deleteEmail = async (emailId) => {
    const resDeleteEmail = await fetch(
      `http://localhost:8000/email/delete/${emailId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    const data = await resDeleteEmail.json();
    setNav(data);
    if (resDeleteEmail.ok) {
      setMyEmails((myEmails) => {
        myEmails.filter((email) => email._id !== emailId);
      });
    }
  };

  const [toggle, setToggle] = useState(false);
  const handleToggle = () => {
    setToggle(!toggle);
  };

  const deleteFieldNumber = (index)=>{
    setNumeriTelefono((numeriTelefono)=> numeriTelefono.filter((el,i)=> i !== index))
  }
  const deleteFieldEmail = (index)=>{
    setEmail((email)=> email.filter((el,i)=> i !== index))
  }

  if (nav) return <Navigate to="/profile-success" />;

  return (
    <div className="containerHomepageUser">
      <div className="itemsHomePageUser">
        <h1>Home page utente</h1>
        <form
          onSubmit={handleUpdateProfile}
          encType="multipart/form-data"
          className="formUpdateUser"
        >
          <div className="itemsUser">
            <div className="containerImageUser">
              <img
                src={`http://localhost:8000/images/${idUtente}.${ext}`}
                className="imageUser"
              />
              <ImageUploadUpdate
                setValidImage={setValidImage}
                file={file}
                setFile={setFile}
                className="imageUpload"
              />
            </div>
            <div className="containerUserItems">
              <div className="userItems">
                <label htmlFor="">ID Utente</label>
                <input
                  type="text"
                  name="idUtente"
                  value={idUtente}
                  readOnly="true"
                />
              </div>
              <div className="userItems">
                <label htmlFor="">Nome Utente</label>
                <input
                  type="text"
                  name="nomeUtente"
                  value={nomeUtente}
                  onChange={(e) => setNomeUtente(e.target.value)}
                />
              </div>
              <div className="userItems">
                <label htmlFor="">Cognome Utente</label>
                <input
                  type="text"
                  name="cognomeUtente"
                  value={cognomeUtente}
                  onChange={(e) => setCognomeUtente(e.target.value)}
                />
              </div>
              <div className="userItems">
                <label htmlFor="">Username Utente</label>
                <input
                  type="text"
                  name="usernameUtente"
                  value={usernameUtente}
                  onChange={(e) => setUsernameUtente(e.target.value)}
                />
              </div>
            </div>

            <div className="btnUpdateUser">
              <button className="aggiornaProfilo">AGGIORNA PROFILO</button>
            </div>
          </div>
          <div className="containerNavbar">
            <div className="navbarUtente">
              <NavbarUtente />
            </div>

            <div className="containerItemsFormNumeriTel">
              <div className="itemsFormNumTel">
                <div className="itemsBtnAddNum">
                  <button
                    onClick={addNumeriTelefonoForm}
                    className="btnAddNumero"
                  >
                    <BiAddToQueue type="button" value="+" />
                  </button>
                  <div>
                    {numeriTelefono.map((elem, i) => {
                      return (
                        <>
                          <FormNumeriTelefono
                            elem={elem}
                            key={i}
                            i={i}
                            handleChange={changeNumeriTelefono}
                            deleteField={deleteFieldNumber}
      
                          />
                        </>
                      );
                    })}
                  </div>
                </div>
                <div className="itemsBtnAddEmail">
                  <button onClick={addEmail} className="btnAddNumero">
                    <BiAddToQueue type="button" value="+" />
                  </button>
                  <div>
                    {email.map((elem, i) => {
                      return (
                        <FormEmail
                          elem={elem}
                          key={i}
                          i={i}
                          handleChange={changeEmail}
                          deleteField={deleteFieldEmail}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* <div className="containerChange">
          <button onClick={handleToggle}>
            {toggle ? <BsSunFill /> : <BsSun />}
          </button>
        </div> */}
        <div className="containerTableNumeri">
          <div className="containerItemsTabs">
            <Tabs
              defaultActiveKey="profile"
              id="uncontrolled-tab-example"
              className="mb-3 containerTabs"
            >
              <Tab
                eventKey="numeriTelefono"
                title="NUMERI TELEFONO"
                className="titleTab"
                id="numeriTelefonoTab"
              >
                <table className="tableVisualizzaDati">
                  <tr>
                    <th className="thTable">Tipologia</th>
                    <th className="thTable">Numero</th>
                    <th className="thTable">Delete</th>
                  </tr>
                  {myNumbers.map((numero, i) => {
                    return (
                      <tr>
                        <td>{numero.tipologiaNumero}</td>
                        <td>{numero.numeroTelefono}</td>
                        <td id="tdDelete">
                          <RiDeleteBin5Line
                            id="iconDelete"
                            onClick={() => deleteNumero(numero._id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </Tab>
              <Tab eventKey="email" title="EMAIL">
                <table className="tableVisualizzaDati">
                  <tr>
                    <th className="thTable">Tipologia</th>
                    <th className="thTable">Email</th>
                    <th className="thTable">Delete</th>
                  </tr>
                  {myEmails.map((email, i) => {
                    return (
                      <tr>
                        <td>{email.tipologiaEmail}</td>
                        <td>{email.email}</td>
                        <td id="tdDelete">
                          <RiDeleteBin5Line
                            id="iconDelete"
                            onClick={() => deleteEmail(email._id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePageUser;
