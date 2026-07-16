import { useLoaderData } from "react-router";

export default function Product() {
  const productData = useLoaderData();
  return (
    <div>
      <img src={productData.image} alt="" />
      <h2>{productData.title}</h2>
      <p>Price: {productData.price} gp</p>
      <br />
      <div>
        <h3>Category</h3>
        <p>{productData.category}</p>
      </div>
      <br />
      <div>
        <h3>Description</h3>
        <p>{productData.description}</p>
      </div>
      <br />
      <p>
        <strong>{productData.rating.rate}/5</strong> ({productData.rating.count}
        )
      </p>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ params }) {
  const url = `https://fakestoreapi.com/products/${params.id}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Response(
      "Error while fetching product data. Response:" + response.statusText,
    );
  } else {
    const responseData = await response.json();
    return responseData;
  }
}
