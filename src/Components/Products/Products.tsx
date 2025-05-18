import React, { useState, useEffect, useCallback } from "react";
import styles from "./products.module.css";

import http from "../../utils/http";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { navigationActions } from "../../store/store";
import { productsAction } from "../../store/store";
import { loadingActions } from "../../store/store";
import usePrivateHttp from "../../hooks/usePrivateHttp";
// ant design:
import type { ColumnType, ColumnsType } from "antd/es/table";
import {
    SearchOutlined,
    CaretDownOutlined,
    EditOutlined,
    InfoCircleOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { Input, Table, Button, Alert } from "antd";
import type { PaginationProps } from "antd";
import Pagination from "antd/es/pagination";
import { AutoComplete, Popconfirm } from "antd";
import { Category } from "../../models/category";
import { ShipmentDetails } from "../../models/ShipmentDetail";
import { shipmentDetails } from "../../datas/ShipmentDetails";
// import DeletePopup from "../DeletePopup/DeletePopup";
const Products: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const privateHttp = usePrivateHttp();
    // isLoading state:
    const isLoading = useAppSelector((state) => state.loading);

    // get products from store:
    // const products = useAppSelector((state) => state.products);
    const shipments = shipmentDetails;
    // categories list:
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);

    // search params:
    const [search, setSearch] = useSearchParams();

    // set page pagination:
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalProducts, setTotalProducts] = useState(0);

    const [isDeleting, setIsDeleting] = useState(false);

    // set delete popup:

    // deleteFailState:
    const [deleteFailState, setDeleteFailState] = useState(false);

    // fetch all categories:
    useEffect(() => {
        const fetchCategories = async () => {
            const res = await privateHttp.get("/api/category/get-categories");
            console.log(res);

            setCategoriesList(res.data);
        };

        // fetchCategories();
    }, [privateHttp]);

    // category drop down options:
    const categoriesDropdownOptions = [
        { value: "All" },
        ...categoriesList.map((category: any) => ({
            value: category.name,
        })),
    ];

    // change page with ant pagination
    const onChangePagination: PaginationProps["onChange"] = useCallback(
        (page: number) => {
            setCurrentPage(page);
        },
        []
    );

    // by default set search params category=All and page = 1
    useEffect(() => {
        search.set("category", "All");
        search.set("page", currentPage.toString());
        setSearch(search, {
            replace: true,
        });
    }, [currentPage, setSearch, search]);

    // get products from database:
    useEffect(() => {
        const getAllProducts = async () => {
            dispatch(loadingActions.setLoading(true));
            try {
                const res = await http.get(
                    process.env.REACT_APP_SERVER_DOMAIN +
                        "/api/product/get-products",
                    {
                        params: search || null,
                    }
                );
                console.log(res.data);

                if (res.data.isLastPage) {
                    dispatch(loadingActions.setLoading(false));
                    dispatch(productsAction.setProducts(res.data.products));
                } else {
                    dispatch(loadingActions.setLoading(false));
                    dispatch(productsAction.setProducts(res.data.products));
                }
                setTotalProducts(res.data.totalProducts);
            } catch (error) {
                console.log(error);
            }
        };
        // getAllProducts();
    }, [search, isDeleting, dispatch]);

    // delete Shipment handler:
    const deleteHandler = useCallback(
        async (product: ShipmentDetails) => {
            // dispatch(loadingActions.setLoading(true));
            // try {
            //     const res = await privateHttp.delete(
            //         "/api/product/delete-product",
            //         {
            //             params: {
            //                 _id: product._id,
            //             },
            //         }
            //     );
            //     dispatch(productsAction.deleteProduct(product._id));
            //     dispatch(loadingActions.setLoading(false));
            //     setIsDeleting((pre) => !pre);
            // } catch (error) {
            //     console.log(error);
            //     setDeleteFailState(true);
            //     dispatch(loadingActions.setLoading(false));
            // }
        },
        [dispatch, privateHttp]
    );

    // ant column:
    type DataIndex = keyof ShipmentDetails;
    const getColumnSearchProps = (
        dataIndex: DataIndex
    ): ColumnType<ShipmentDetails> => ({
        filterDropdown: () => (
            <div onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    onChange={(e) => {
                        if (e.target.value === "") {
                            search.delete(`${dataIndex}Query`);
                        } else {
                            search.set(`${dataIndex}Query`, e.target.value);
                        }
                        setSearch(search, {
                            replace: true,
                        });
                    }}
                    style={{ display: "block" }}
                />
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined
                style={{ color: filtered ? "#1677ff" : undefined }}
            />
        ),
    });

    const columns: ColumnsType<ShipmentDetails> = [
        {
            title: "Id",
            dataIndex: "shipment_id",
            key: "shipment_id",
            width: "15%",
            ...getColumnSearchProps("shipment_id"),
        },
        {
            title: "Name",
            dataIndex: "order_id",
            key: "order_id",
            width: "20%",
            ...getColumnSearchProps("order_id"),
        },
        {
            title: "Vehicle",
            dataIndex: "vehicle_id",
            key: "vehicle_id",
            width: "20%",
            ...getColumnSearchProps("order_id"),
            render: (shortDescription) => {
                return (
                    <div className={styles["product-description"]}>
                        {shortDescription}
                    </div>
                );
            },
        },

        {
            title: "Route",
            dataIndex: "route_id",
            key: "route_id",
            width: "5%",
            ...getColumnSearchProps("route_id"),
        },

        // {
        //     title: "Category",
        //     dataIndex: "category",
        //     key: "category",
        //     width: "10%",
        //     render: (category) => {
        //         return <span>{category.name}</span>;
        //     },
        //     filterDropdown: () => {
        //         return (
        //             <AutoComplete
        //                 style={{
        //                     width: "100%",
        //                 }}
        //                 placeholder={"search category here"}
        //                 options={categoriesDropdownOptions}
        //                 filterOption={(inputValue, option) =>
        //                     option!.value
        //                         .toUpperCase()
        //                         .indexOf(inputValue.toUpperCase()) !== -1
        //                 }
        //                 onSelect={(value, option) => {
        //                     console.log(option);
        //                     if (value === "All") {
        //                         search.delete("category");
        //                     } else {
        //                         const cateId = categoriesList.filter(
        //                             (c) => c.name === value
        //                         )[0]._id;
        //                         search.set("category", cateId);
        //                     }
        //                     setSearch(search, {
        //                         replace: true,
        //                     });
        //                 }}
        //             />
        //         );
        //     },
        //     filterIcon: () => {
        //         return <CaretDownOutlined />;
        //     },
        // },

        {
            title: "Actions",
            width: "10%",
            render: (_, record) => {
                return (
                    <div style={{ display: "flex", gap: "4px" }}>
                        <Button
                            onClick={(e) =>
                                navigate(
                                    "/admin/product-detail" +
                                        `/${record.shipment_id}`,
                                    {
                                        state: {
                                            product: record,
                                        },
                                    }
                                )
                            }
                            icon={<InfoCircleOutlined />}
                        />

                        <Button
                            onClick={(e) =>
                                navigate(
                                    "/admin/edit-product" +
                                        `/${record.shipment_id}`,
                                    {
                                        state: {
                                            product: record,
                                        },
                                    }
                                )
                            }
                            type="primary"
                            icon={<EditOutlined />}
                        />

                        <Popconfirm
                            title="Delete"
                            description="Are you sure to delete this product?"
                            onConfirm={() => {
                                deleteHandler(record);
                            }}
                            okButtonProps={{ loading: isLoading }}
                        >
                            <Button
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

    // Return tsx:
    return (
        <div className="tableWrapper">
            <div className={styles.heading}>
                <h2>Products List</h2>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/admin/add-product");
                        dispatch(
                            navigationActions.setNavigationState("add-product")
                        );
                    }}
                >
                    Add New
                </button>
            </div>
            <div className="tableContent">
                {deleteFailState && (
                    <Alert
                        message="Can not delete"
                        description="This product can not be deleted because it is now in an user's cart!!!"
                        type="error"
                        closable
                        onClose={() => {
                            setDeleteFailState(false);
                        }}
                    />
                )}

                <Table
                    columns={columns}
                    dataSource={shipments}
                    pagination={false}
                    loading={isLoading}
                />

                <div className={styles["pagination"]}>
                    <Pagination
                        current={currentPage}
                        onChange={onChangePagination}
                        total={totalProducts}
                        pageSize={5}
                    />
                </div>
            </div>
        </div>
    );
};

export default Products;
