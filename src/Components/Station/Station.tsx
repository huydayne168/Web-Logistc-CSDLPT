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
import { Input, Table, Button, Dropdown, Tag, Alert } from "antd";
import { Popconfirm } from "antd";
import { Order } from "../../models/Order";
import { Station } from "../../models/Station";
import regions from "../../datas/Regions";
// import DeletePopup from "../DeletePopup/DeletePopup";
const Stations: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const privateHttp = usePrivateHttp();
    // isLoading state:
    const isLoading = useAppSelector((state) => state.loading);

    // search params:
    const [search, setSearch] = useSearchParams();
    const currentRegion = useAppSelector((state) => state.region.id);
    // flash sale:
    const [stations, setStations] = useState<Station[]>([]);

    const [isDeleting, setIsDeleting] = useState(false);
    const [otherRegion, setOtherRegion] = useState<string>("");
    // get vouchers from database:
    useEffect(() => {
        const getAllVouchers = async () => {
            dispatch(loadingActions.setLoading(true));
            try {
                const res = await http.get(
                    `/${currentRegion}/get_tables/station`
                );
                console.log(res.data.recordset);
                setStations(res.data.recordset);
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
                `/${currentRegion}/${region}/get_tables/station`
            );
            console.log(res.data.recordset);
            dispatch(loadingActions.setLoading(false));
            setStations((prev) => res.data.recordset);
            setOtherRegion(region);
        } catch (error) {
            console.log(error);
        }
    };

    // delete flash sale handler:
    const deleteHandler = useCallback(
        async (station: Station) => {
            dispatch(loadingActions.setLoading(true));
            try {
                const res = await http.delete(
                    `/${currentRegion}/delete_table/station/${station.station_id}`
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
    type DataIndex = keyof Station;
    // type Checkouts = [{ product: Checkout; quantity: number }];
    const getColumnSearchProps = (
        dataIndex: DataIndex
    ): ColumnType<Station> => ({
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

    const columns: ColumnsType<Station> = [
        {
            title: "Id",
            dataIndex: "station_id",
            key: "station_id",
            width: "15%",
            ...getColumnSearchProps("station_id"),
        },
        {
            title: "Station Name",
            dataIndex: "station_name",
            key: "station_name",
            width: "20%",
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
                <h2>Stations List</h2>
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
                    dataSource={stations}
                    pagination={false}
                    loading={isLoading}
                />
            </div>
        </div>
    );
};

export default Stations;
