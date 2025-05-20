import React, { useCallback, useEffect, useState } from "react";
// import { useParams } from "react-router";
import usePrivateHttp from "../../hooks/usePrivateHttp";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { loadingActions } from "../../store/store";

import http from "../../utils/http";
import CustomerForm from "../CustomerForm/CustomerForm";
const AddCustomer: React.FC = () => {
    const dispatch = useAppDispatch();
    const [errMess, setErrMess] = useState(false);
    const currentRegion = useAppSelector((state) => state.region.id);
    // post product data to server to add a new product:
    const handleAddProduct = useCallback(async (station: any) => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        const {
            order_id,
            station_id,
            customer_id,
            customs_id,
            status,
            created_at,
            amount,
            expected_delivery,
            total_weight,
            otherRegion,
        } = station;
        try {
            dispatch(loadingActions.setLoading(true));
            const url =
                currentRegion.trim().toUpperCase() ===
                otherRegion.trim().toUpperCase()
                    ? `/${currentRegion}/insert_table/orders`
                    : `/${currentRegion}/${otherRegion}/insert_table/orders`;
            const response = await http.post(url, {
                order_id,
                customer_id,
                station_id,
                customs_id,
                status,
                created_at,
                amount,
                expected_delivery,
                total_weight,
            });
            console.log(response);
            dispatch(loadingActions.setLoading(false));
        } catch (error) {
            setErrMess(true);
            dispatch(loadingActions.setLoading(false));
            console.log(error);
        }
    }, []);

    // return tsx:
    return (
        <CustomerForm errMess={errMess} handleProductFn={handleAddProduct} />
    );
};

export default AddCustomer;
