import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../services/auth/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const Login = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/");
      console.log("Autenticação efetuada com sucesso!");
    } catch (err) {
      if (err.response) {
        alert(
          `Ocorreu um erro na autenticação (${err.response.status || null}): ${
            err.response.data?.error || "Desconhecido"
          }`
        );
      } else if (err.request) {
        alert(
          "Sem resposta do servidor! Verifique a sua conexão e tente novamente"
        );
      } else {
        alert(`Ocorreu um erro inesperado: ${err.message}`);
      }
    }
  };

  return (
    <div className="auth-container">
      <h3 className="fw-bold">CoinLogger</h3>
      <p className="mb-5">Plataforma de Gestão de Finanças Pessoais</p>
      <form onSubmit={Login} className="auth-form gap-3">
        <div className="form-floating">
          <input
            type="email"
            value={email}
            className="form-control"
            placeholder="Endereço de email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Endereço de email</label>
        </div>
        <div className="position-relative form-floating">
          <FontAwesomeIcon
            style={{
              position: "absolute",
              right: "10px",
              top: "21px",
              zIndex: "1000",
              cursor: "pointer",
            }}
            icon={showPassword ? faEyeSlash : faEye}
            onClick={() => setShowPassword(!showPassword)}
          />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            className="form-control"
            placeholder="Palavra-passe"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Palavra-passe</label>
        </div>
        <div className="d-grid gap-1">
          <button type="submit" className="btn btn-success">
            Entrar
          </button>
          <Link to="/signup" className="btn btn-outline-success">
            Criar conta
          </Link>
        </div>
      </form>
    </div>
  );
}
