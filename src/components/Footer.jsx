export default function Footer() {
  return (
    <footer className="footer glass py-3 mt-5">
      <div className="container text-center">
        <p className="mb-1">
          © {new Date().getFullYear()} <strong>Cachi Explorer</strong> — Todos
          los derechos reservados.
        </p>
        <small className="text-muted">
          Desarrollado por <span className="text-light">Leandro Torres</span>
        </small>
      </div>
    </footer>
  );
}
