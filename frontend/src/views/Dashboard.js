export default function Dashboard() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-0 fw-bold">Dashboard</h2>
        <p className="mb-0">Saldo atual: {0}€</p>
      </div>
      <hr />
      <div>
        <p>Relatórios Mensais (Receitas e Despesas)</p>
      </div>
    </>
  );
}
