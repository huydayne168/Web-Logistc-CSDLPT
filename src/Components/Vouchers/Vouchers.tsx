import React, { useState, useEffect, useCallback } from "react";
import styles from "./vouchers.module.css";

import http from "../../utils/http";
import type { Product } from "../../models/product";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { navigationActions } from "../../store/store";
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
import { Input, Table, Button, Dropdown, Tag, Alert } from "antd";
import type { PaginationProps } from "antd";
import Pagination from "antd/es/pagination";
import { Popconfirm } from "antd";
import { Voucher } from "../../models/voucher";
import { Order } from "../../models/Order";
import regions from "../../datas/Regions";
// import DeletePopup from "../DeletePopup/DeletePopup";
const Vouchers: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const privateHttp = usePrivateHttp();
    // isLoading state:
    const isLoading = useAppSelector((state) => state.loading);

    // search params:
    const [search, setSearch] = useSearchParams();
    const currentRegion = useAppSelector((state) => state.region.id);
    // flash sale:
    const [orders, setOrders] = useState<Order[]>([]);

    const [isDeleting, setIsDeleting] = useState(false);
    const [otherRegion, setOtherRegion] = useState<string>("");

    // get vouchers from database:
    useEffect(() => {
        const getAllVouchers = async () => {
            dispatch(loadingActions.setLoading(true));
            try {
                const res = await http.get(
                    `/${currentRegion}/get_tables/orders`
                );
                console.log(res.data.recordset);
                setOrders(res.data.recordset);
                dispatch(loadingActions.setLoading(false));
            } catch (error) {
                console.log(error);
            }
        };
        getAllVouchers();
    }, [search, isDeleting]);
    const getOrderFromOtherRegions = async (region: string) => {
        dispatch(loadingActions.setLoading(true));
        try {
            const res = await http.get(
                `/${currentRegion}/${region}/get_tables/orders`
            );
            console.log(res.data.recordset);
            dispatch(loadingActions.setLoading(false));
            setOrders((prev) => res.data.recordset);
            setOtherRegion(region);
        } catch (error) {
            console.log(error);
        }
    };

    // delete flash sale handler:
    const deleteHandler = useCallback(
        async (order: Order) => {
            dispatch(loadingActions.setLoading(true));
            try {
                const res = await http.delete(
                    `/${currentRegion}/delete_table/orders/${order.order_id}`
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
    type DataIndex = keyof Order;
    // type Checkouts = [{ product: Checkout; quantity: number }];
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Order> => ({
        filterDropdown: ({}) => (
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

    const columns: ColumnsType<Order> = [
        {
            title: "Id",
            dataIndex: "order_id",
            key: "order_id",
            width: "20%",
            ...getColumnSearchProps("order_id"),
        },
        {
            title: "Customer",
            dataIndex: "customer_id",
            key: "customer_id",
            width: "10%",
        },
        {
            title: "Custom",
            dataIndex: "customs_id",
            key: "customs_id",
            width: "10%",
        },
        {
            title: "Station",
            dataIndex: "station_id",
            key: "station_id",
            width: "10%",
        },

        {
            title: "Created At",
            dataIndex: "created_at",
            key: "created_at",
            width: "20%",
            render: (end) => {
                return <span>{end}</span>;
            },
        },

        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: "10%",
        },

        {
            title: "Actions",
            width: "8%",
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
                            disabled={currentRegion !== otherRegion}
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
                <h2>Orders List</h2>
                <select
                    onChange={(e) => {
                        setOtherRegion(e.target.value);
                        getOrderFromOtherRegions(e.target.value);
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
                    dataSource={orders}
                    pagination={false}
                    loading={isLoading}
                />
            </div>
        </div>
    );
};

export default Vouchers;
