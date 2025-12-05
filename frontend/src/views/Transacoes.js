import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Fetch from "../services/transacoes/fetch";
import Delete from "../services/transacoes/delete";
import FetchCategorias from "../services/categorias/fetch";

export default function Transacoes() {
  const { categorias } = FetchCategorias();
  const { items, fetchData, ct, setCt } = Fetch();

  return (
    <>
      <div className="row g-3 align-items-center">
        <div className="col-12 col-md-4 col-lg-3">
          {/** Filtragem das transações por categoria */}
          <select
            value={ct}
            onChange={(e) => setCt(e.target.value)}
            className="form-select"
          >
            <option value="">Todas as categorias</option>
            {categorias?.map((data) => (
              <option key={data.id} value={data.nome}>
                {data.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-4 col-lg-3 ms-auto text-md-end">
          {/** Hiperligação para a página de registo */}
          <Link to="/transacoes/registar" className="btn btn-success">
            Registar transação
          </Link>
        </div>
      </div>
      <div className="mt-3 table-responsive">
        <table className="table table-light table-bordered caption-top">
          {/** Nº de transações registadas */}
          {/** apenas são contadas as transações registadas pelo utilizador autenticado */}
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
            {/** Detalhes das transações */}
            {items?.map((data) => (
              <tr key={data.id}>
                <td
                  title={data.id}
                  className="text-truncate"
                  style={{ maxWidth: "100px" }}
                >
                  {data.id}
                </td>
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
                    {/** Atualizar */}
                    <Link to={`/transacoes/atualizar/${data.id}`}>
                      <FontAwesomeIcon icon={faPenToSquare} className="fs-4" />
                    </Link>
                    {/** Apagar */}
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
