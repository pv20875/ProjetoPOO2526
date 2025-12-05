import { useState } from "react";
import axios from "axios";
import endpoint from "../../config/endpoint";

export default function CreateCategoria({ fetchData }) {
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
        // limpa os campos
        setNome("");
        setDescricao("");
        // recarrega a lista
        fetchData();
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
    <form onSubmit={Create} className="row g-2 align-items-center">
      <div className="col-md-5">
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="form-control"
          placeholder="Nome"
          required
        />
      </div>
      <div className="col-md-5">
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="form-control"
          placeholder="Descrição"
          required
        />
      </div>
      <div className="col-md-2 d-grid">
        <button type="submit" className="btn btn-success">
          Registar categoria
        </button>
      </div>
    </form>
  );
}
