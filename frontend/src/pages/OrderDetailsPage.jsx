import React from "react";

import UserOrderDetails from "../components/UserOrderDetails";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const OrderDetailsPage = () => {
  return (
    <div>
      <Header />
      <UserOrderDetails />
      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
