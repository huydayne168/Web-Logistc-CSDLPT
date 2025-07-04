import React, { useState, useEffect, useCallback } from "react";
import styles from "./transaction.module.css";
import usePrivateHttp from "../../hooks/usePrivateHttp";
import { useSearchParams } from "react-router-dom";
import type { PaginationProps } from "antd";
import Pagination from "antd/es/pagination";
import type { ColumnType, ColumnsType } from "antd/es/table";
import { Input, Table, Button, Dropdown, Tag, Popconfirm } from "antd";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import {
    SearchOutlined,
    CaretDownOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { checkoutsAction, loadingActions } from "../../store/store";
import { Checkout } from "../../models/checkout";
import { Product } from "../../models/product";
import type { MenuProps } from "antd/es/menu";
import TransactionDetail from "./TransactionDetail";
import http from "../../utils/http";
import { Route } from "../../models/Route";
import regions from "../../datas/Regions";
function Transactions() {
    const checkouts = useAppSelector((state) => state.checkouts);
    const dispatch = useAppDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCheckouts, setTotalCheckouts] = useState(0);
    const [selectCheckout, setSelectCheckout] = useState<Route | null>(null);
    const [openDetailPopup, setOpenDetailPopup] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const isLoading = useAppSelector((state) => state.loading);
    const [search, setSearch] = useSearchParams();
    const privateHttp = usePrivateHttp();
    const [routes, setRoutes] = useState<Route[]>([]);
    const currentRegion = useAppSelector((state) => state.region.id);
    const [otherRegion, setOtherRegion] = useState<string>("");

    // get all routes here:
    useEffect(() => {
        const getCheckouts = async () => {
            dispatch(loadingActions.setLoading(true));
            try {
                const res = await http.get(
                    `/${currentRegion}/get_tables/route`
                );
                console.log(res.data.recordset);
                setRoutes(res.data.recordset);
                dispatch(loadingActions.setLoading(false));
            } catch (error) {
                console.log(error);
            }
        };

        getCheckouts();
    }, [search, isDeleting]);

    const getRouteFromOtherRegions = async (region: string) => {
        dispatch(loadingActions.setLoading(true));
        try {
            const res = await http.get(
                `/${currentRegion}/${region}/get_tables/route`
            );
            console.log(res.data.recordset);
            dispatch(loadingActions.setLoading(false));
            setRoutes((prev) => res.data.recordset);
            setOtherRegion(region);
        } catch (error) {
            console.log(error);
        }
    };

    // delete checkout handler:
    const deleteHandler = useCallback(
        async (route: Route) => {
            dispatch(loadingActions.setLoading(true));
            try {
                const res = await http.delete(
                    `/${currentRegion}/delete_table/route/${route.route_id}`
                );
                dispatch(loadingActions.setLoading(false));
                setIsDeleting((pre) => !pre);
            } catch (error) {
                dispatch(loadingActions.setLoading(false));
            }
        },
        [dispatch, currentRegion]
    );

    // Column type:
    type DataIndex = keyof Route;
    type Products = [{ product: Product; quantity: number }];
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Route> => ({
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

    // columns data
    const columns: ColumnsType<Route> = [
        {
            title: "ID",
            dataIndex: "route_id",
            key: "route_id",
            width: "15%",
        },
        {
            title: "From",
            dataIndex: "station_from",
            key: "station_from",
            width: "15%",
            ...getColumnSearchProps("station_from"),
        },
        {
            title: "To",
            dataIndex: "station_to",
            key: "station_to",
            width: "25%",
            ...getColumnSearchProps("station_to"),
        },

        {
            title: "Distance",
            dataIndex: "distance",
            key: "distance",
            width: "15%",
            ...getColumnSearchProps("distance"),
        },

        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: "10%",
        },

        {
            title: "Actions",
            width: "20%",
            dataIndex: "actions",
            key: "actions",
            render: (_, record) => {
                return (
                    <div style={{ display: "flex", gap: "4px" }}>
                        <Button
                            icon={<InfoCircleOutlined />}
                            onClick={() => {
                                setSelectCheckout(record);
                                setOpenDetailPopup(true);
                            }}
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
                                disabled={currentRegion !== otherRegion}
                            />
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

    const closePopup = useCallback(() => {
        setOpenDetailPopup(false);
    }, []);
    return (
        <div className="tableWrapper">
            <div className={styles.heading}>
                <h2>Routes List</h2>
                <select
                    onChange={(e) => {
                        setOtherRegion(e.target.value);
                        getRouteFromOtherRegions(e.target.value);
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
                    dataSource={routes}
                    pagination={false}
                    loading={isLoading}
                />
                <TransactionDetail
                    open={openDetailPopup}
                    checkout={[selectCheckout]}
                    closePopup={closePopup}
                />
            </div>
        </div>
    );
}

export default Transactions;
