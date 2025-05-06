import styles from "./users.module.css";
import { useCallback, useEffect, useState } from "react";
import usePrivateHttp from "../../hooks/usePrivateHttp";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { PaginationProps } from "antd";
import Pagination from "antd/es/pagination";
import type { ColumnType, ColumnsType } from "antd/es/table";
import { Input, Table, Button } from "antd";
import { customers } from "../../datas/Customers";

import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Customer } from "../../models/Customer";
const Users: React.FC<{}> = () => {
    const privateHttp = usePrivateHttp();
    const navigate = useNavigate();
    // states:
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useSearchParams();
    const [users, setUsers] = useState<Customer[]>(customers);
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

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

    // get users from database
    // useEffect(() => {
    //     const getUsers = async () => {
    //         setIsLoading(true);
    //         try {
    //             const res = await privateHttp.get("/user/get-users", {
    //                 params: search || null,
    //             });

    //             setIsLoading(false);
    //             setUsers((prev) => res.data.users);
    //             setTotalUsers(res.data.totalUsers);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };

    //     getUsers();
    // }, [search, privateHttp]);

    // Column type:
    type DataIndex = keyof Customer;
    const getColumnSearchProps = (
        dataIndex: DataIndex
    ): ColumnType<Customer> => ({
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
    const columns: ColumnsType<Customer> = [
        {
            title: "ID",
            dataIndex: "customer_id",
            key: "customer_id",
            width: "28%",
            ...getColumnSearchProps("customer_id"),
        },
        {
            title: "User",
            dataIndex: "name",
            key: "name",
            width: "15%",
            ...getColumnSearchProps("name"),
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            width: "25%",

            ...getColumnSearchProps("address"),
        },

        {
            title: "Phone Number",
            dataIndex: "phone_number",
            key: "phone_number",
            width: "15%",
            ...getColumnSearchProps("phone_number"),
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
                                    "/admin/user-info/" + record.customer_id,
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
