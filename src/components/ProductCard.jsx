export default function ProductCard({ title, subtitle, img, cta = "Ver más" }) {
  return (
    <div className="product-card h-100">
      <div className="card h-100">
        {img && <img src={img} className="card-img-top" alt={title} />}
        <div className="card-body">
          <h5 className="card-title mb-1">{title}</h5>
          {subtitle && <p className="card-text lead-muted">{subtitle}</p>}
          <button className="btn btn-brand btn-sm mt-1">{cta}</button>
        </div>
      </div>
    </div>
  );
}
