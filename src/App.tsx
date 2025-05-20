import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Components/Root/Root";
import DashBoard from "./Components/Dashboard/DashBoard";
import Products from "./Components/Shipments/Products";
import Transactions from "./Components/Transactions/Transactions";
import AddProduct from "./Components/AddProduct/AddProduct";
import Users from "./Components/users/Users";
import ProductDetail from "./Components/ProductDetail/ProductDetail";
import EditProduct from "./Components/EditProduct/EditProduct";
import TagsAndCategories from "./Components/TagsAndCategories/TagsAndCategories";
import ErrorPage from "./Components/error/ErrorPage";
import UserInfo from "./Components/users/UserInfo";
import FlashSales from "./Components/FlashSales/FlashSales";
import Vouchers from "./Components/Vouchers/Vouchers";
import Stations from "./Components/Station/Station";
import Customers from "./Components/Customers/Customers";
import AddCustomer from "./Components/AddCustomer/AddCustomer";
import AddRoute from "./Components/AddRoute/AddRoute";
function App() {
    const router = createBrowserRouter([
        {
            path: "",
            element: <Root />,
            children: [
                {
                    path: "*",
                    element: <ErrorPage />,
                },
                {
                    path: "/",
                    element: <DashBoard />,
                    index: true,
                },
                {
                    path: "customers",
                    element: <Customers />,
                },
                {
                    path: "users",
                    element: <Users />,
                },
                {
                    path: "user-info/:userId",
                    element: <UserInfo />,
                },
                {
                    path: "shipments",
                    element: <Products />,
                },
                {
                    path: "routes",
                    element: <Transactions />,
                },
                {
                    path: "stations",
                    element: <Stations />,
                },
                {
                    path: "tagsCategories/:tagsCategories",
                    element: <TagsAndCategories />,
                },
                {
                    path: "add-product",
                    element: <AddProduct />,
                },
                {
                    path: "product-detail/:productId",
                    element: <ProductDetail />,
                },

                {
                    path: "edit-product/:productId",
                    element: <EditProduct />,
                },
                {
                    path: "flash-sales",
                    element: <FlashSales />,
                },

                {
                    path: "add-customer",
                    element: <AddCustomer />,
                },

                {
                    path: "vouchers",
                    element: <Vouchers />,
                },

                {
                    path: "add-route",
                    element: <AddRoute />,
                },
            ],
        },
    ]);
    return <RouterProvider router={router} />;
}

export default App;
