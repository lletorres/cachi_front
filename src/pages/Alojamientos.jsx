import ProductCard from "../components/ProductCard";
import alojamiento1 from "../assets/alojamiento1.png";
import alojamiento2 from "../assets/alojamiento2.png";
import alojamiento3 from "../assets/alojamiento3.png";

export default function Alojamientos() {
  const items = [
    {
      title: "Posada El Nevado",
      subtitle: "Desayuno incluido · Wi-Fi",
      img: alojamiento1,
    },
    {
      title: "Hostal Cielo Andino",
      subtitle: "Vista panorámica · Habitaciones dobles",
      img: alojamiento2,
    },
    {
      title: "Casa de Adobe",
      subtitle: "Estilo rústico · Patio interior",
      img: alojamiento3,
    },
  ];

  return (
    <div className="container">
      <div className="d-flex align-items-end justify-content-between mb-3">
        <div>
          <h1 className="h3 mb-1">Alojamientos</h1>
          <p className="lead-muted">
            Posadas y hospedajes con el encanto de los Valles Calchaquíes.
          </p>
        </div>
      </div>

      <div className="row g-3">
        {items.map((item, i) => (
          <div className="col-md-4" key={i}>
            <ProductCard {...item} cta="Ver disponibilidad" />
          </div>
        ))}
      </div>
    </div>
  );
}
