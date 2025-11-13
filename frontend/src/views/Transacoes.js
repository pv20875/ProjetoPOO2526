import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import FetchTransacoes from "../services/transacoes/Fetch";
import Delete from "../services/transacoes/Delete";

export default function Transacoes() {
  const { items, fetchData } = FetchTransacoes();

  return (
    <>
      <div className="d-flex justify-content-end">
        <Link to="/transacoes/registar" className="btn btn-success">
          Registar transação
        </Link>
      </div>
      <div className="table-responsive">
        <table className="table table-light table-bordered caption-top">
          <caption>
            Transações registadas: <strong>{items?.length || 0}</strong>
          </caption>
          <thead className="table-secondary">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Descrição</th>
              <th scope="col">Valor</th>
              <th scope="col">Data</th>
              <th scope="col">Categoria</th>
              <th scope="col">Tipo</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {items?.map((data) => (
              <tr key={data.id}>
                <th scope="row">{data.id}</th>
                <td className="text-truncate" title={data.descricao}>
                  {data.descricao}
                </td>
                <td>
                  {data.tipo === "Despesa" ? (
                    <span className="text-danger fw-bold">-{data.valor}€</span>
                  ) : (
                    <span className="text-success fw-bold">+{data.valor}€</span>
                  )}
                </td>
                <td>{data.data}</td>
                <td>{data.categoria}</td>
                <td>{data.tipo}</td>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <Link to={`/transacoes/atualizar/${data.id}`}>
                      <FontAwesomeIcon icon={faPenToSquare} className="fs-4" />
                    </Link>
                    <Link
                      onClick={() => Delete(data.id, fetchData)}
                      className="link-danger"
                    >
                      <FontAwesomeIcon icon={faTrashCan} className="fs-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
