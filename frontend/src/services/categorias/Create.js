import { useState } from "react";
import axios from "axios";
import endpoint from "../../config/endpoint";

export default function CreateCategoria() {
  // parametros da categoria
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const Create = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${endpoint}/categorias/create`,
        { nome, descricao },
        { withCredentials: true }
      );

      if (res.data) {
        alert(res.data?.msg);
      }
    } catch (err) {
      if (err.response) {
        alert(
          `Ocorreu um erro ao criar a categoria (${
            err.response.status || null
          }): ${err.response.data?.error || "Desconhecido"}`
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
    <div className="d-flex justify-content-center py-5 px-3 bg-white border border-1">
      <form
        onSubmit={Create}
        style={{ maxWidth: "550px" }}
        className="auth-form gap-3"
      >
        <div className="form-floating">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="form-control"
            placeholder="Nome"
            required
          />
          <label>Nome</label>
        </div>
        <div className="form-floating">
          <textarea
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="form-control"
            placeholder="Descrição"
            required
          />
          <label>Descrição</label>
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-success">
            Registar categoria
          </button>
        </div>
      </form>
    </div>
  );
}
