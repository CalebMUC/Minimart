import React from "react";
import ProductPage from "../src/components/ProductPage";
import ReturnsAndOrdersPage from "../src/components/ReturnsAndOrdersPage";
import ProductDetail from "../src/components/ProductDetailPage";
import MainPage from "../src/components/MinimartMainPage";
import Checkout from "../src/components/CheckOutPage";
import CreateMarketPlace from "../src/components/CreateMarketPlace";
import Layout from "../src/components/Layout";
import SubCategories from "../src/components/SubCategory";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../src/components/Login";
import AddProductPage from "../src/components/AddProducts";
import Register from "../src/components/Register";
import Header from "../src/components/Header";
import { CartProvider } from "./components/CartContext";
import { CheckOutProvider } from "./components/CheckOutContext";
import { UserProvider } from "./components/UserMainContext";
import '@fortawesome/fontawesome-free/css/all.min.css';
// import "./index.css";

const App = () => {
  return (
  <UserProvider>
    <CartProvider>
      <CheckOutProvider>
        <Router>
          {/* <Header /> */}
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Load MainPage when the root URL is accessed */}
              <Route index element={<MainPage />} />

              {/* Other Routes */}
              <Route path="/product/:productName/:productID" element={<ProductDetail />} />
              <Route path="/products/:subCategoryName" element={<SubCategories />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/CreateMarketPlace" element={<CreateMarketPlace />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/AddProducts" element={<AddProductPage />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/ProductPage" element={<ProductPage />} />
              <Route path="/ReturnsAndOrdersPage" element={<ReturnsAndOrdersPage />} />
            </Route>
          </Routes>
        </Router>
      </CheckOutProvider>
    </CartProvider>
    </UserProvider>
  );
};

export default App;
