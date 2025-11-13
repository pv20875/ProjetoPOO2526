import axios from "axios";
import endpoint from "../../config/endpoint";

const Delete = async (id, fetchReload) => {
  if (!window.confirm("Apagar transação?")) return;
  try {
    await axios.delete(`${endpoint}/transacoes/delete/${id}`, {
      withCredentials: true,
    });

    // recarregar lista
    fetchReload();
  } catch (err) {
    if (err.response) {
      alert(
        `Ocorreu um erro ao apagar a transação (${
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

export default Delete;
