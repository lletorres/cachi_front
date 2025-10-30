import ProductCard from "../components/ProductCard";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="display-5 fw-bold">Descubrí Cachi</h1>
              <p className="lead lead-muted">
                Explorá excursiones, sabores locales y alojamientos únicos.
                Inspirado en tu proyecto original, con un diseño limpio y
                moderno.
              </p>
              <div className="d-flex gap-2">
                <a href="/excursiones" className="btn btn-brand btn-lg">
                  Explorar excursiones
                </a>
                <a
                  href="/alojamientos"
                  className="btn btn-outline-light btn-lg"
                >
                  Ver alojamientos
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-banner"></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIONES RÁPIDAS */}
      <section className="py-4">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-2">
            <h2 className="h4 m-0">Excursiones destacadas</h2>
            <a href="/excursiones" className="link-light">
              Ver todas
            </a>
          </div>
          <div className="row g-3">
            <div className="col-md-4">
              <ProductCard
                title="Trekking al Valle Encantado"
                subtitle="Nivel medio · 4 h"
                img="https://images.unsplash.com/photo-1526481280698-8fcc13fd604e?q=80&w=1200&auto=format&fit=crop"
              />
            </div>
            <div className="col-md-4">
              <ProductCard
                title="Atardecer en Miradores"
                subtitle="Tour fotográfico · 2 h"
                img="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
              />
            </div>
            <div className="col-md-4">
              <ProductCard
                title="Bodega y Degustación"
                subtitle="3 copas + tabla regional"
                img="https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1200&auto=format&fit=crop"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
