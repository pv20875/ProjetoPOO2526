import Relatorios from "../services/relatorios";

export default function Dashboard() {
  const { Calcular, data, startDate, setStartDate, endDate, setEndDate } =
    Relatorios();

  return (
    <>
      {/** Formulário para selecionar o intervalo de datas */}
      <form className="row g-3 align-items-end" onSubmit={Calcular}>
        {/** Data de início */}
        <div className="col-md-5">
          <label className="form-label">Data de início</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        {/** Data de fim */}
        <div className="col-md-5">
          <label className="form-label">Data de fim</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="col-md-2 d-grid">
          <button type="submit" className="btn btn-success">
            Calcular
          </button>
        </div>
      </form>
      {/** Resultados do cálculo */}
      {data && (
        <div className="row g-3 justify-content-center my-3">
          {/** Receitas */}
          <div className="col-12 col-md-4">
            <div className="card bg-success-subtle text-success w-100">
              <div className="card-body">
                <h5 className="card-title">Receitas</h5>
                <h3 className="card-text fw-bold">
                  {data.relatorios?.receitas || 0}€
                </h3>
              </div>
            </div>
          </div>
          {/** Despesas */}
          <div className="col-12 col-md-4">
            <div className="card bg-danger-subtle text-danger w-100">
              <div className="card-body">
                <h5 className="card-title">Despesas</h5>
                <h3 className="card-text fw-bold">
                  {data.relatorios?.despesas || 0}€
                </h3>
              </div>
            </div>
          </div>
          {/** Saldo */}
          <div className="col-12 col-md-4">
            <div className="card w-100">
              <div className="card-body">
                <h5 className="card-title">Saldo</h5>
                <h3
                  className={`card-text fw-bold ${
                    (data.relatorios?.saldo || 0) > 0
                      ? "text-success"
                      : (data.relatorios?.saldo || 0) < 0
                      ? "text-danger"
                      : ""
                  }`}
                >
                  {data.relatorios?.saldo || 0}€
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
