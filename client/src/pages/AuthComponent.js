import { useContext, createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthComponent = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [userData, setUserData] = useState({});

  //* AuthComponent é usato per wrappare tutta l'applicatione e isAuth e setIsAuth sono disponibily a tutti i componenti figli,
  //* compresi barra di navigazione e componente di Login.
    useEffect(() => {
        const verifyToken = async () => {
            const res = await fetch(`http://localhost:8000/auth/jwt-verify`, {
                credentials:'include'
            })
            setIsAuth(res.ok)//* Mi va a settare la variabile isAuth a ok e dunque sono verificato se isAuth è vero
        }
        verifyToken()
    }, [])

    //* Questo useEffect serve per prendere i dari dai cookie
    useEffect(() => {
        const setData = async () => {
            const cookie = Cookies.get("user");
            const user = JSON.parse(cookie);
            setUserData(user);
        }
        setData()
    }, [])

  return(
    <AuthContext.Provider value={{isAuth, setIsAuth, userData, setUserData}} >
        {children}
    </AuthContext.Provider>
  ) ;
};

export default AuthComponent