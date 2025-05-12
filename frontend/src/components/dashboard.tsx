// import { useContext } from "react";
// import Products from "../pages/products/product.tsx";
// import "./dashboard.css";
// import { UserContext } from "../context/userContext.tsx";

// const Dashboard = () => {
//   const { user } = useContext(UserContext);
//   return (
//     <div>
//       <h2 className="dashboard-username">Hi {user?.fullname}</h2>
//       <h1 style={{ color: "black" }}>Welcome to meroDokan</h1>
//       <p>This is private</p>
//       <Products />
//     </div>
//   );
// };

// export default Dashboard;
import { useContext } from "react";
import Products from "../pages/products/product";
import "./dashboard.css";
import { UserContext } from "../context/userContext";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome back, <span className="username">{user?.fullname}</span> 👋</h2>
        <p>Browse the latest products available at meroDokan.</p>
      </div>
      <Products />
    </div>
  );
};

export default Dashboard;
