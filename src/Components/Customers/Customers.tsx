import React, { useState, useEffect, useCallback } from "react";
import styles from "./vouchers.module.css";

import http from "../../utils/http";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { navigationActions } from "../../store/store";
import { loadingActions } from "../../store/store";
import usePrivateHttp from "../../hooks/usePrivateHttp";
// ant design:
import type { ColumnType, ColumnsType } from "antd/es/table";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { Input, Table, Button, Dropdown, Tag, Alert, Popconfirm } from "antd";
import type { PaginationProps } from "antd";
import { Customer } from "../../models/Customer";
import regions from "../../datas/Regions";
import { current } from "@reduxjs/toolkit";
import { ShipmentDetails } from "../../models/ShipmentDetail";
// import DeletePopup from "../DeletePopup/DeletePopup";
const Customers: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const privateHttp = usePrivateHttp();
    // isLoading state:
    const [isLoading, setIsLoading] = useState(false);

    // search params:
    const [search, setSearch] = useSearchParams();
    const currentRegion = useAppSelector((state) => state.region.id);
    // flash sale:
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [isDeleting, setIsDeleting] = useState(false);

    const [otherRegion, setOtherRegion] = useState<string>(currentRegion);

    // get vouchers from database:
    useEffect(() => {
        const getAllVouchers = async () => {
            dispatch(loadingActions.setLoading(true));
            try {
                const res = await http.get(
                    `/${currentRegion}/get_tables/customer`
                );
                console.log(res.data.recordset);
                setCustomers(res.data.recordset);
                dispatch(loadingActions.setLoading(false));
            } catch (error) {
                console.log(error);
            }
        };
        getAllVouchers();
    }, [search, isDeleting]);

    // get customs from other regions:
    const getCustomersFromOtherRegions = async (region: string) => {
        setIsLoading(true);
        try {
            const res = await http.get(
                `/${currentRegion}/${region}/get_tables/customer`
            );
            console.log(res.data.recordset);
            setIsLoading(false);
            setCustomers((prev) => res.data.recordset);
            setOtherRegion(region);
        } catch (error) {
            console.log(error);
        }
    };

    // delete flash sale handler:
    const deleteHandler = useCallback(
        async (shipment: Customer) => {
            dispatch(loadingActions.setLoading(true));
            try {
                const res = await http.delete(
                    `/${currentRegion}/delete_table/shipment_details/${shipment.customer_id}`
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
    type DataIndex = keyof Customer;
    // type Checkouts = [{ product: Checkout; quantity: number }];
    const getColumnSearchProps = (
        dataIndex: DataIndex
    ): ColumnType<Customer> => ({
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

    const columns: ColumnsType<Customer> = [
        {
            title: "Id",
            dataIndex: "customer_id",
            key: "customer_id",
            width: "10%",
            ...getColumnSearchProps("customer_id"),
        },
        {
            title: "Customer Name",
            dataIndex: "name",
            key: "name",
            width: "10%",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: "15%",
        },
        {
            title: "Phone",
            dataIndex: "phone_number",
            key: "phone_number",
            width: "15%",
        },

        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            width: "20%",
        },

        {
            title: "Country",
            dataIndex: "country_id",
            key: "country_id",
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
                <h2>Customer List</h2>
                <select
                    onChange={(e) => {
                        setOtherRegion(e.target.value);
                        getCustomersFromOtherRegions(e.target.value);
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
                    dataSource={customers}
                    pagination={false}
                    loading={isLoading}
                />
            </div>
        </div>
    );
};

export default Customers;
