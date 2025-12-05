import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import endpoint from "../config/endpoint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function SignupPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const Signup = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${endpoint}/signup`, {
        nome,
        email,
        password,
      });

      alert("Conta registada com sucesso!");
    } catch (err) {
      if (err.response) {
        alert(
          `Ocorreu um erro no registo (${err.response.status || null}): ${
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
      <form onSubmit={Signup} className="auth-form gap-3">
        <div className="form-floating">
          <input
            type="text"
            value={nome}
            placeholder="Nome"
            className="form-control"
            required
            onChange={(e) => setNome(e.target.value)}
          />
          <label>Nome</label>
        </div>
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
            className="btn-password"
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
          <button type="submit" className="btn btn-primary">
            Criar conta
          </button>
          <Link to="/login" className="btn btn-outline-primary">
            Entrar
          </Link>
        </div>
      </form>
    </div>
  );
}
