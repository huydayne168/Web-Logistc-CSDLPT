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
import regions from "../../datas/Regions";
import { current } from "@reduxjs/toolkit";
// import DeletePopup from "../DeletePopup/DeletePopup";
const Products: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const privateHttp = usePrivateHttp();
    // isLoading state:
    const isLoading = useAppSelector((state) => state.loading);

    const currentRegion = useAppSelector((state) => state.region.id);

    const [shipments, setShipments] = useState<ShipmentDetails[]>([]);

    // search params:
    const [search, setSearch] = useSearchParams();

    // set page pagination:
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalProducts, setTotalProducts] = useState(0);

    const [isDeleting, setIsDeleting] = useState(false);
    const [otherRegion, setOtherRegion] = useState<string>(currentRegion);
    // change page with ant pagination
    const onChangePagination: PaginationProps["onChange"] = useCallback(
        (page: number) => {
            setCurrentPage(page);
        },
        []
    );

    // get products from database:
    useEffect(() => {
        const getAllShipments = async () => {
            dispatch(loadingActions.setLoading(true));
            try {
                const res = await http.get(
                    `/${currentRegion}/get_tables/shipment_details`
                );
                console.log(res.data.recordset);
                setShipments((prev) => res.data.recordset);
                dispatch(loadingActions.setLoading(false));
            } catch (error) {
                console.log(error);
            }
        };
        getAllShipments();
    }, [dispatch, currentRegion]);

    const getShipmentFromOtherRegions = async (region: string) => {
        dispatch(loadingActions.setLoading(true));
        try {
            const res = await http.get(
                `/${currentRegion}/${region}/get_tables/shipment_details`
            );
            console.log(res.data.recordset);
            dispatch(loadingActions.setLoading(false));
            setShipments((prev) => res.data.recordset);
            setOtherRegion(region);
        } catch (error) {
            console.log(error);
        }
    };

    // delete Shipment handler:
    const deleteHandler = useCallback(
        async (shipment: ShipmentDetails) => {
            dispatch(loadingActions.setLoading(true));
            try {
                const res = await http.delete(
                    `/${currentRegion}/delete_table/shipment_details/${shipment.shipment_id}`
                );
                dispatch(loadingActions.setLoading(false));
                setIsDeleting((pre) => !pre);
            } catch (error) {
                dispatch(loadingActions.setLoading(false));
            }
        },
        [dispatch, currentRegion]
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

        {
            title: "Actions",
            width: "10%",
            render: (_, record) => {
                return (
                    <div style={{ display: "flex", gap: "4px" }}>
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
                                disabled={currentRegion !== otherRegion}
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
                <h2>Shipment Details List</h2>
                <select
                    onChange={(e) => {
                        setOtherRegion(e.target.value);
                        getShipmentFromOtherRegions(e.target.value);
                    }}
                    defaultValue={currentRegion}
                >
                    {regions.map((region) => {
                        return (
                            <option
                                key={region.location}
                                value={region.id}
                                disabled={region.id === currentRegion}
                            >
                                {region.id.toUpperCase()}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="tableContent">
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
