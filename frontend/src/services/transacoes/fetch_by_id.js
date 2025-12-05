import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import endpoint from "../../config/endpoint";

export default function FetchTransacaoById() {
  const { id } = useParams();

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState(0);
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tipo, setTipo] = useState("");

  useEffect(() => {
    axios
      .get(`${endpoint}/transacoes/transacao/${id}`, { withCredentials: true })
      .then((res) => {
        const data = res.data;

        if (data) {
          setDescricao(data.descricao);
          setValor(data.valor);
          setData(data.data);
          setCategoria(data.categoria);
          setTipo(data.tipo);
        }
      })
      .catch((err) => {
        if (err.response) {
          alert(
            `Ocorreu um erro ao obter a transação (${
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
      });
  }, [id]);

  return {
    id,
    descricao,
    setDescricao,
    valor,
    setValor,
    data,
    setData,
    categoria,
    setCategoria,
    tipo,
    setTipo,
  };
}
