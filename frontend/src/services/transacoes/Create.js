import { useState } from "react";
import axios from "axios";
import endpoint from "../../config/endpoint";
import FetchCategorias from "../categorias/fetch";

export default function CreateTransacao() {
  // lista de categorias (importada)
  const { categorias } = FetchCategorias();
  // parametros da transação
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState(0);
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tipo, setTipo] = useState("");

  const Create = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${endpoint}/transacoes/create`,
        { descricao, valor, data, categoria, tipo },
        { withCredentials: true }
      );

      if (res.data) {
        alert(res.data?.msg);
      }
    } catch (err) {
      if (err.response) {
        alert(
          `Ocorreu um erro ao criar a transação (${
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
        <div className="form-floating">
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(parseFloat(e.target.value))}
            className="form-control"
            placeholder="Valor"
            required
          />
          <label>Valor</label>
        </div>
        <div className="form-floating">
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="form-control"
            placeholder="Data"
            required
          />
          <label>Data</label>
        </div>
        <div className="form-floating">
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="form-select"
            required
          >
            <option value="">Selecionar opção</option>
            {categorias?.map((data) => (
              <option key={data.id} value={data.nome}>
                {data.nome}
              </option>
            ))}
          </select>
          <label>Categoria</label>
        </div>
        <div className="form-floating">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="form-select"
            required
          >
            <option value="">Selecionar opção</option>
            <option value="Receita">Receita</option>
            <option value="Despesa">Despesa</option>
          </select>
          <label>Tipo</label>
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-success">
            Registar transação
          </button>
        </div>
      </form>
    </div>
  );
}
