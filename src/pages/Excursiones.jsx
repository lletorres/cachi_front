import ProductCard from "../components/ProductCard";
import excursion1 from "../assets/excursion1.png";
import excursion2 from "../assets/excursion2.png";
import excursion3 from "../assets/excursion3.png";

export default function Excursiones() {
  const items = [
    {
      title: "Cerro XXX",
      subtitle: "Senderismo · 3 h",
      img: excursion1,
    },
    {
      title: "Quebrada YYY",
      subtitle: "4x4 · 5 h",
      img: excursion2,
    },
    {
      title: "Cachi de Noche",
      subtitle: "Citytour · 2 h",
      img: excursion3,
    },
  ];
  return (
    <div className="container">
      <div className="d-flex align-items-end justify-content-between mb-3">
        <div>
          <h1 className="h3 mb-1">Excursiones</h1>
          <p className="lead-muted">Elegí tu experiencia en Cachi.</p>
        </div>
      </div>
      <div className="row g-3">
        {items.map((it, i) => (
          <div className="col-md-4" key={i}>
            <ProductCard {...it} />
          </div>
        ))}
      </div>
    </div>
  );
}
