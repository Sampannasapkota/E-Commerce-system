import Products from "../pages/products/product";

const Dashboard = () => {
  // const { user } = useContext(UserContext);
  return (
    <div>
      {/* <h1>Hi {user?.fullname}</h1> */}
      <h1 style={{ color: "black" }}>Welcome to meroDokan</h1>
      <Products />
    </div>
  );
};

export default Dashboard;
