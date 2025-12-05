import { useEffect, useState } from "react";
import axios from "axios";
import endpoint from "../config/endpoint";

export default function Relatorios() {
  const [data, setData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const Calcular = async (e) => {
    if (e) e.preventDefault();

    try {
      const res = await axios.get(
        `${endpoint}/relatorios?start_date=${startDate}&end_date=${endDate}`,
        {
          withCredentials: true,
        }
      );

      setData(res.data);
    } catch (err) {
      if (err.response) {
        alert(
          `Ocorreu um erro ao calcular os relatórios (${
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
    Calcular();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    Calcular,
    data,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  };
}
