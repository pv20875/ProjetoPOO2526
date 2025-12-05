import Fetch from "../services/categorias/fetch";
import Create from "../services/categorias/create";

export default function Categorias() {
  const { categorias, fetchData } = Fetch();

  return (
    <>
      {/** Formulário de registo de categorias */}
      <Create fetchData={fetchData} />
      <div className="mt-3 table-responsive">
        <table className="table table-light table-bordered caption-top">
          <caption>
            Categorias registadas: <strong>{categorias?.length || 0}</strong>
          </caption>
          <thead className="table-secondary">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nome</th>
              <th scope="col">Descrição</th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {categorias?.map((data) => (
              <tr key={data.id}>
                <td
                  title={data.id}
                  className="text-truncate"
                  style={{ maxWidth: "100px" }}
                >
                  {data.id}
                </td>
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
