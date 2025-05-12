// import axios from "axios";
// import { useEffect, useState } from "react";
// import "./product.css";

// interface Product {
//   id: number;
//   seller_id: number;
//   name: string;
//   quantity: number;
//   category: string;
//   description: string;
//   price: number;
//   is_active: boolean;
// }

// interface ProductResponse {
//   totalCount: number;
//   products: Product[];
// }

// const Products = () => {
//   const [searchText, setSearchText] = useState("");
//   const [data, setData] = useState<Product[]>([]);
//   const [filteredData, setFilteredData] = useState<Product[]>([]);
//   const token = localStorage.getItem("token");

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get<ProductResponse>(
//         "http://localhost:3000/products",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log("Fetched Data:", response.data);
//       if (response.status === 200) {
//         setData(response.data.products);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     if (searchText) {
//       const filtered = data.filter((product) =>
//         product.name.toLowerCase().includes(searchText.toLowerCase())
//       );
//       setFilteredData(filtered);
//     } else {
//       setFilteredData(data);
//     }
//   }, [searchText, data]);

//   const tableData = searchText ? filteredData : data;
//   const headerKeys = tableData.length > 0 ? Object.keys(tableData[0]) : [];

//   return (
//     <div className="products-container">
//       <h1 className="products-heading">Products List</h1>
//       <input
//         type="text"
//         placeholder="Search by name"
//         onChange={(e) => setSearchText(e.target.value)}
//         className="search-input"
//       />
//       <table className="products-table">
//         <thead>
//           <tr>
//             {headerKeys.map((key) => (
//               <th key={key}>{key}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {tableData.map((product) => (
//             <tr>
//               <td>{product.id}</td>
//               <td>{product.seller_id}</td>
//               <td>{product.name}</td>
//               <td>{product.quantity}</td>
//               <td>{product.category}</td>
//               <td>{product.description}</td>
//               <td>{product.price}</td>
//               <td>{product.is_active}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {tableData.length === 0 && (
//         <p className="no-product-message">This product is not available</p>
//       )}
//     </div>
//   );
// };

// export default Products;
import axios from "axios";
import { useEffect, useState } from "react";
import "./product.css";

interface Product {
  id: number;
  seller_id: number;
  name: string;
  image: string;
  quantity: number;
  category: string;
  description: string;
  price: number;
  is_active: boolean;
  image_url: string;
}

const Products = () => {
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Group by category
  const groupedByCategory: Record<string, Product[]> = {};
  for (const product of products) {
    if (
      !searchText ||
      product.name.toLowerCase().includes(searchText.toLowerCase())
    ) {
      if (!groupedByCategory[product.category]) {
        groupedByCategory[product.category] = [];
      }
      groupedByCategory[product.category].push(product);
    }
  }

  return (
    <div className="products-wrapper">
      <div className="products-toolbar">
        <h2>Browse Products</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-bar"
        />
      </div>

      {Object.entries(groupedByCategory).map(([category, items]) => (
        <div key={category} className="category-section">
          <h3 className="category-title">{category}</h3>
          <div className="product-grid">
            {items.map((product) => (
              <div className="product-card" key={product.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h4>{product.name}</h4>
                <p className="product-desc">{product.description}</p>
                <p className="price">${product.price}</p>
                <p className={product.is_active ? "active" : "inactive"}>
                  {product.is_active ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(groupedByCategory).length === 0 && (
        <p className="no-product-message">No products found.</p>
      )}
    </div>
  );
};

export default Products;
