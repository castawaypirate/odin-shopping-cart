export default function Card({ product }) {
  return (
    <div className="card">
      <img src={product.image} />
      <p>{product.title}</p>
      <p>{product.price}</p>
    </div>
  );
}
