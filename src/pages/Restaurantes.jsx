import ProductCard from "../components/ProductCard";
import resto1 from "../assets/resto1.png";
import resto2 from "../assets/resto2.png";
import resto3 from "../assets/resto3.png";

export default function Restaurantes() {
  const items = [
    {
      title: "La Peña del Cachi",
      subtitle: "Comida regional · Música en vivo",
      img: resto1,
    },
    {
      title: "Bodega La Quebrada",
      subtitle: "Degustaciones · Menú maridado",
      img: resto2,
    },
    {
      title: "Cocina de Altura",
      subtitle: "Gastronomía andina contemporánea",
      img: resto3,
    },
  ];

  return (
    <div className="container">
      <div className="d-flex align-items-end justify-content-between mb-3">
        <div>
          <h1 className="h3 mb-1">Restaurantes</h1>
          <p className="lead-muted">
            Sabores locales y cocina de autor en el corazón de Cachi.
          </p>
        </div>
      </div>

      <div className="row g-3">
        {items.map((item, i) => (
          <div className="col-md-4" key={i}>
            <ProductCard {...item} cta="Reservar mesa" />
          </div>
        ))}
      </div>
    </div>
  );
}
