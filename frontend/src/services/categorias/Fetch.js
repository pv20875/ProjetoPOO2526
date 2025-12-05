import { useEffect, useState } from "react";
import axios from "axios";
import endpoint from "../../config/endpoint";

export default function FetchCategorias() {
  const [categorias, setCategorias] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${endpoint}/categorias/list`, {
        withCredentials: true,
      });

      if (res.data) {
        setCategorias(res.data);
      }
    } catch (err) {
      if (err.response) {
        alert(
          `Ocorreu um erro ao obter as categorias (${
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

  useEffect(() => {
    fetchData();
  }, []);

  return { categorias, setCategorias, fetchData };
}
