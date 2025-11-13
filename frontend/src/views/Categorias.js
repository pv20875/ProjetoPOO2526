import { Link } from "react-router-dom";
import FetchCategorias from "../services/categorias/Fetch";

export default function Categorias() {
  const { items } = FetchCategorias();

  return (
    <>
      <div className="d-flex justify-content-end">
        <Link to="/categorias/registar" className="btn btn-success">
          Registar categoria
        </Link>
      </div>
      <div className="table-responsive">
        <table className="table table-light table-bordered caption-top">
          <caption>
            Categorias registadas: <strong>{items?.length || 0}</strong>
          </caption>
          <thead className="table-secondary">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nome</th>
              <th scope="col">Descrição</th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {items?.map((data) => (
              <tr key={data.id}>
                <th scope="row">{data.id}</th>
                <td>{data.nome}</td>
                <td className="text-truncate">{data.descricao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
