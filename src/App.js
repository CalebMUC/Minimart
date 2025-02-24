import React from "react";
import ProductPage from "../src/components/ProductPage";
import ReturnsAndOrdersPage from "../src/components/ReturnsAndOrdersPage";
import ProductDetail from "../src/components/ProductDetailPage";
import MainPage from "../src/components/MinimartMainPage";
import Checkout from "../src/components/CheckOutPage";
import MainCheckout from "../src/components/MainCheckoutPage";
import CreateMarketPlace from "../src/components/CreateMarketPlace";
import Layout from "../src/components/Layout";
import SubCategories from "../src/components/SubCategory";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../src/components/Login";

import AddProductPage from "../src/components/Products/AddProducts";
import AddCategories from "../src/components/Products/AddCategories";
// import AddProductForm from "../src/components/Products/AddproductForm";


import Merchants from "../src/components/Merchants/MaintainMerchants";
import MerchantOrders from "../src/components/Merchants/MerchantOrders";

// import Merchants from "../src/components/Merchants";  
import ProductFeatures from "../src/components/ProductFeatures";
import Register from "../src/components/Register";
import SearchPage from "../src/components/SearchPage";
import Reports from "../src/components/Reports";
import DeliveryForm from "../src/components/Deliveryform";
import MpesaForm from "../src/components/MpesaForm";
import CreditCardForm from "../src/components/CreditCardForm";
import AddressForm from "../src/components/AddressForm";

//jsx
import DeliveryModeSection from "../src/components/DeliveryModeSection";
import AddressSection  from "../src/components/AddressSection";
import OrderSummarySection  from "../src/components/OrderSummarySection";
import ItemSection from "../src/components/ItemSection";
import PaymentSection from "../src/components/PaymentSection";

import GeneralSettings from "../src/components/Settings/GeneralSettings";

import Header from "../src/components/Header";
import { CartProvider } from "./components/CartContext";
import { CheckOutProvider } from "./components/CheckOutContext";
import { UserProvider } from "./components/UserMainContext";
import '@fortawesome/fontawesome-free/css/all.min.css';
import AccountSection from "./components/Settings/AccountSection/AccountSection";
import PersonalInformation from "./components/Settings/AccountSection/PersonalInformation";
// import "./index.css";

const App = () => {
  return (
  <UserProvider>
    <CartProvider>
      <CheckOutProvider>
        <Router>
          {/* <Header /> */}
          <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Settings/GeneralSettings" element={<GeneralSettings />} />
            <Route path="/" element={<Layout />}>
              {/* Load MainPage when the root URL is accessed */}
              <Route index element={<MainPage />} />
  
              {/* Other Routes */}
              <Route path="/product/:productName/:productID" element={<ProductDetail />} />
              <Route path="/products/:subCategoryName" element={<SubCategories />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/MainCheckout" element={<MainCheckout />} />

              <Route path="/DeliveryForm" element={<DeliveryForm />} />
              <Route path="/MpesaForm" element={<MpesaForm />} />
              <Route path="/CreditCardForm" element={<CreditCardForm />} />
              <Route path="/AddressForm" element={<AddressForm />} />

              <Route path="/DeliveryModeSection" element={<DeliveryModeSection />} />
              <Route path="/OrderSummarySection" element={<OrderSummarySection />} />
              <Route path="/ItemSection" element={<ItemSection />} />
              <Route path="/PaymentSection" element={<PaymentSection />} />
              <Route path="/AddressSection" element={<AddressSection />} />

              <Route path="/CreateMarketPlace" element={<CreateMarketPlace />} />
              

              {/* <Route path="/AddProducts" element={<AddProductPage />} /> */}

              <Route path="/Products/AddCategories" element={<AddCategories />} />
              <Route path="/Products/AddProducts" element={<AddProductPage />} />

              
              <Route path="/Settings/AccountSection/AccountSection" element={<AccountSection />} />
              <Route path="/Settings/AccountSection/PersonalInformatiom" element={<PersonalInformation />} />
              {/* <Route path="/Products/AddProductForm" element={<AddProductForm />} /> */}

              <Route path="/Merchants/MaintainMerchants" element={<Merchants />} />
              <Route path="/Merchants/MerchantOrders" element={<MerchantOrders />} />

              <Route path="/Reports" element={<Reports />} />
              <Route path="/ProductFeatures" element={<ProductFeatures />} />
              
              <Route path="/SearchPage/:Name/:categoryID/:subCategoryID" element={<SearchPage />} />
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
