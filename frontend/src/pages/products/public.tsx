import axios from "axios";
import { useEffect, useState } from "react";

function Public() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((response) => {
        console.log(response.data.products);
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  }, []);

  return (
    <div>
      <h1 style={{ color: "black" }}>This is public</h1>
      <p style={{ color: "black" }}>Product: </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ol>
        {products.map((product: any) => (
          <li style={{ color: "black" }} key={product.id}>
            <strong>{product.name}</strong>({product.category})
            <br />
            Rs.{product.price} (Qty: {product.quantity})
            <br />
            {product.description}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Public;
