// import axios from 'axios';
// import React, { useEffect, useState } from 'react';

// function ProductsList() {
//   // const [products, setProducts] = useState([]);
//   // const [error, setError] = useState(null);

//   useEffect(() => {
//     axios.get('http://localhost:3000/products')
//       .then(response => {
//         console.log(response.data)
//         // setProducts(response.data);
//       })
//       .catch(error => {
//         // setError(error.message);
//         console.log('error occured')
//       });
//   }, []);

//   return (
//     <div>
//       <h1>Products List</h1>
      
//     </div>
//   );
// }

// export default ProductsList;

import axios from "axios";
import { useEffect, useState } from "react";

interface Item {
  id: number;
  name: string;
  quantity: number;
  category: string;
  description: string;
  price: number;
}

interface ItemResponse {
  item: Item;
}
const Products = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState<ItemResponse[]>([]);
  const [filteredData, setFilteredData] = useState<ItemResponse[]>([]);
  const headerKeys = data[0] ? Object.keys(data[0].item) : [];
  const token = localStorage.getItem('token')
  const filterByName = (name: string) => {
    const filteredData = data?.filter(({ item }: ItemResponse) =>
      item.name.toLowerCase().includes(name.toLowerCase())
    );
    setFilteredData(filteredData);
  };
  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched Data:", response.data);
      if (response.status === 200) {
        setData(response.data.products);
      }
    } catch (error) {
      console.log({ error });
    }
  };
  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (searchText !== "") {
      filterByName(searchText);
    } else {
      setFilteredData(data);
    }
  }, [searchText, data]);
  const tableData = searchText ? filteredData : data;

  return (
    <div className="products-container">
      <h1>All products</h1>
      <input
        type="text"
        placeholder="Search by name"
        onChange={(e) => setSearchText(e.target.value)}
        className="search-input"
      />
      <table className="products-table">
        <thead>
          <tr>
            {headerKeys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map(({ item }: ItemResponse) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {tableData.length === 0 && (
        <p className="no-product-message">This product is not available</p>
      )}
    </div>
  );
};
export default Products;
