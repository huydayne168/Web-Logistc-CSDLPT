import React, { Fragment, useState, useEffect } from "react";
import styles from "./user-info.module.css";
import { Descriptions } from "antd";
import type { DescriptionsProps } from "antd";
import { useLocation } from "react-router-dom";
import DashboardTable from "../Dashboard/DashboardTable";
import usePrivateHttp from "../../hooks/usePrivateHttp";
import { Checkout } from "../../models/checkout";
import http from "../../utils/http";
import { Customer } from "../../models/Customer";
const UserInfo: React.FC = () => {
    const location = useLocation();
    const userInfo: Customer = location.state.userInfo;
    const [userCheckouts, setUserCheckouts] = useState<Checkout[]>([]);

    // get user checkout:
    // useEffect(() => {
    //     const getUserCheckouts = async () => {
    //         try {
    //             const res = await http.get(
    //                 process.env.REACT_APP_SERVER_DOMAIN + "/user/get-user",
    //                 {
    //                     params: {
    //                         _id: userInfo.customer_id,
    //                     },
    //                 }
    //             );
    //             setUserCheckouts(res.data.userCheckouts);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };
    //     getUserCheckouts();
    // }, [userInfo.customer_id]);

    const items: DescriptionsProps["items"] = [
        {
            key: "customer_id",
            label: "Id",
            children: userInfo.customer_id,
        },
        {
            key: "name",
            label: "UserName",
            children: userInfo.name,
        },
        {
            key: "telephone",
            label: "Telephone",
            children: userInfo.phone_number,
        },
        {
            key: "email",
            label: "Email",
            children: userInfo.address,
        },
    ];
    console.log(userCheckouts);

    return (
        <Fragment>
            <Descriptions
                title="User Info"
                items={items}
                className={styles["user-info"]}
            />
            <DashboardTable checkouts={userCheckouts} />
        </Fragment>
    );
};

export default UserInfo;
