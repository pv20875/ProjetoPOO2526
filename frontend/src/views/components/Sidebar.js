import { useContext, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import useResponsiveMenu from "../../useResponsiveMenu";
import { AuthContext } from "../../services/auth/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
// páginas
import Dashboard from "../Dashboard";
import Transacoes from "../Transacoes";
import CreateTransacao from "../../services/transacoes/Create";
import UpdateTransacao from "../../services/transacoes/Update";
import Categorias from "../Categorias";
import CreateCategoria from "../../services/categorias/Create";
import Utilizadores from "../Utilizadores";

export default function Sidebar({ presentUser }) {
  const { logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(true);
  useResponsiveMenu(setIsOpen);

  return (
    <>
      {/** Navbar */}
      <nav
        className="d-none navbar navbar-expand-lg text-bg-dark sticky-top"
        data-bs-theme="dark"
      >
        <div className="container-fluid justify-content-end">
          <FontAwesomeIcon
            type="button"
            className="fs-3 py-1"
            icon={isOpen ? faAnglesLeft : faAnglesRight}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </nav>
      {/** Sidebar */}
      <header
        style={{
          marginLeft: !isOpen && "-330px",
        }}
        className="text-bg-dark"
        data-bs-theme="dark"
      >
        <div className="d-flex flex-column">
          <div className="d-flex flex-column justify-content-center">
            <h5 className="text-truncate">Bem-vindo, {presentUser.nome}</h5>
            <small>{presentUser.perfil}</small>
          </div>
          <hr />
          <div className="nav-menu">
            <ul>
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/transacoes" className="nav-link">
                  Transações
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/categorias" className="nav-link">
                  Categorias
                </NavLink>
              </li>
              {presentUser?.perfil?.includes("Administrador") && (
                <li className="nav-item">
                  <NavLink to="/utilizadores" className="nav-link">
                    Utilizadores
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
        <button
          onClick={logout}
          className="position-absolute bottom-0 start-0 end-0 btn btn-danger w-100"
        >
          Terminar sessão
        </button>
      </header>
      <main
        style={{
          marginLeft: !isOpen && "-330px",
        }}
      >
        <div style={{ marginLeft: "330px" }} className="py-5 px-4">
          {/** Rotas */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/** Transações */}
            <Route path="/transacoes" element={<Transacoes />} />
            <Route path="/transacoes/registar" element={<CreateTransacao />} />
            <Route
              path="/transacoes/atualizar/:id"
              element={<UpdateTransacao />}
            />
            {/** Categorias */}
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/categorias/registar" element={<CreateCategoria />} />
            {/** Utilizadores */}
            {presentUser?.perfil?.includes("Administrador") && (
              <Route path="/utilizadores" element={<Utilizadores />} />
            )}
          </Routes>
        </div>
      </main>
    </>
  );
}
