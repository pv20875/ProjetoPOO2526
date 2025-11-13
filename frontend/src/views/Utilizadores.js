import { useEffect, useState } from "react";
import axios from "axios";
import endpoint from "../config/endpoint";

export default function Utilizadores() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${endpoint}/auth/list`, {
          withCredentials: true,
        });

        if (res.data) {
          setItems(res.data);
        }
      } catch (err) {
        if (err.response) {
          alert(
            `Ocorreu um erro ao obter os utilizadores (${
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
    fetchData();
  }, []);

  return (
    <div className="table-responsive">
      <table className="table table-light table-bordered caption-top">
        <caption>
          Utilizadores registados: <strong>{items?.length || 0}</strong>
        </caption>
        <thead className="table-secondary">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nome</th>
            <th scope="col">Email</th>
            <th scope="col">Perfil</th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {items?.map((data) => (
            <tr key={data.id}>
              <th scope="row">{data.id}</th>
              <td className="text-truncate">{data.nome}</td>
              <td>{data.email}</td>
              <td>{data.perfil}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
