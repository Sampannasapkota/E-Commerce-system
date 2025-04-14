import axios from "axios";
import { useEffect, useState } from "react";
import Data from "../../data.json";

const AUTH_TOKEN = {};
interface Item {
  id: number;
  name: string;
  quanity: number;
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
  const headerKeys = Object.keys(Data[0]);
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
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      console.log({ response });
      if (response.status === 200) {
        setData(response.data);
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
      setFilteredData(filteredData);
    }
  }, [searchText]);
  const tableData = searchText ? filteredData : data;

  return (
    <div className="products-container">
      <h1>All products</h1>
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
              <td>{item.quanity}</td>
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
