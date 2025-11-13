import { createContext, useState, useEffect } from "react";
import axios from "axios";
import endpoint from "../../config/endpoint";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [presentUser, setPresentUser] = useState(null);

  //pt: Carrega o utilizador atual
  //en: Load current user
  const loadUser = async () => {
    try {
      const res = await axios.get(`${endpoint}/auth/me`, {
        //pt: enviar cookies
        //en: send cookies
        withCredentials: true,
      });
      //pt: define o utilizador atual
      //en: set the current user
      setPresentUser(res.data);
    } catch {
      //pt: remove utilizador
      //en: remove user
      setPresentUser(null);
    }
  };

  //pt: carregar utilizador ao montar
  //en: load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  //pt: Autenticação
  //en: Authentication
  const login = async (email, password) => {
    await axios.post(
      `${endpoint}/login`,
      { email, password },
      { withCredentials: true }
    );
    //pt: recarregar utilizador
    //en: reload user
    await loadUser();
  };

  //pt: Desautenticação
  //en: Logout
  const logout = async () => {
    if (!window.confirm("Sair da conta?")) return;

    await axios.post(`${endpoint}/logout`, {}, { withCredentials: true });
    setPresentUser(null);
  };

  //pt: Provedor de contexto
  //en: Context provider
  return (
    <AuthContext.Provider value={{ presentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
