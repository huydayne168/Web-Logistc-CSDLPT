import styles from "./users.module.css";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { PaginationProps } from "antd";
import Pagination from "antd/es/pagination";
import type { ColumnType, ColumnsType } from "antd/es/table";
import { Input, Table, Button } from "antd";

import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Customs } from "../../models/Custom";
import http from "../../utils/http";
import { useAppSelector } from "../../hooks/useStore";
import regions from "../../datas/Regions";
const Users: React.FC<{}> = () => {
    const navigate = useNavigate();
    // states:
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useSearchParams();
    const [users, setUsers] = useState<Customs[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [otherRegion, setOtherRegion] = useState<string>("");

    const currentRegion = useAppSelector((state) => state.region.id);

    // by default set search params category=All and page = 1
    useEffect(() => {
        search.set("page", currentPage.toString());
        setSearch(search, {
            replace: true,
        });
    }, [currentPage, search, setSearch]);

    // change page with ant pagination
    const onChangePagination: PaginationProps["onChange"] = useCallback(
        (page: number) => {
            setCurrentPage(page);
        },
        []
    );
    console.log(currentPage);

    //get users from database
    useEffect(() => {
        const getUsers = async () => {
            setIsLoading(true);
            try {
                const res = await http.get(
                    `${currentRegion}/get_tables/customs`
                );
                console.log(res.data.recordset);
                setIsLoading(false);
                setUsers((prev) => res.data.recordset);
                setTotalUsers(res.data.totalUsers);
            } catch (error) {
                console.log(error);
            }
        };

        getUsers();
    }, [search]);

    // get customs from other regions:
    const getCustomsFromOtherRegions = async (region: string) => {
        setIsLoading(true);
        try {
            const res = await http.get(
                `/${currentRegion}/${region}/get_tables/customs`
            );
            console.log(res.data.recordset);
            setIsLoading(false);
            setUsers((prev) => res.data.recordset);
            setTotalUsers(res.data.totalUsers);
            setOtherRegion(region);
        } catch (error) {
            console.log(error);
        }
    };

    // Column type:
    type DataIndex = keyof Customs;
    const getColumnSearchProps = (
        dataIndex: DataIndex
    ): ColumnType<Customs> => ({
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

    // columns data
    const columns: ColumnsType<Customs> = [
        {
            title: "ID",
            dataIndex: "customs_id",
            key: "customs_id",
            width: "28%",
            ...getColumnSearchProps("customs_id"),
        },
        {
            title: "Country",
            dataIndex: "country_id",
            key: "country_id",
            width: "15%",
            ...getColumnSearchProps("country_id"),
        },
        {
            title: "Regulation",
            dataIndex: "regulation",
            key: "regulation",
            width: "25%",

            ...getColumnSearchProps("regulation"),
        },

        {
            title: "Processing Time",
            dataIndex: "processing_time",
            key: "processing_time",
            width: "15%",
            ...getColumnSearchProps("processing_time"),
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
                                // setOpenDetailPopup(true);
                                navigate(
                                    "/admin/user-info/" + record.customs_id,
                                    {
                                        state: {
                                            userInfo: record,
                                        },
                                    }
                                );
                            }}
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <div className="tableWrapper">
            <div className={styles.heading}>
                <h2>Users List</h2>

                <select
                    onChange={(e) => {
                        setOtherRegion(e.target.value);
                        getCustomsFromOtherRegions(e.target.value);
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
                    dataSource={users}
                    pagination={false}
                    loading={isLoading}
                />

                <div className={styles["pagination"]}>
                    <Pagination
                        current={currentPage}
                        onChange={onChangePagination}
                        total={totalUsers}
                        pageSize={5}
                        style={{ margin: "auto" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Users;
