import React, { useCallback, useEffect, useState } from "react";
// import { useParams } from "react-router";
import usePrivateHttp from "../../hooks/usePrivateHttp";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { loadingActions } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Product } from "../../models/product";
import ProductForm from "../ProductForm/ProductForm";
import { Station } from "../../models/Station";
import http from "../../utils/http";
import RouteForm from "../RouteForm/RouteForm";
const AddRoute: React.FC = () => {
    const privateHttp = usePrivateHttp();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [errMess, setErrMess] = useState(false);
    const currentRegion = useAppSelector((state) => state.region.id);
    // post product data to server to add a new product:
    const handleAddProduct = useCallback(async (station: any) => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        const {
            route_id,
            station_from,
            station_to,
            distance,
            estimated_time,
            type,
            otherRegion,
        } = station;
        try {
            dispatch(loadingActions.setLoading(true));
            const url =
                currentRegion.trim().toUpperCase() ===
                otherRegion.trim().toUpperCase()
                    ? `/${currentRegion}/insert_table/route`
                    : `/${currentRegion}/${otherRegion}/insert_table/route`;
            const response = await http.post(url, {
                route_id,
                station_from,
                station_to,
                distance,
                estimated_time,
                type,
            });
            dispatch(loadingActions.setLoading(false));
        } catch (error) {
            setErrMess(true);
            dispatch(loadingActions.setLoading(false));
            console.log(error);
        }
    }, []);

    // return tsx:
    return <RouteForm errMess={errMess} handleProductFn={handleAddProduct} />;
};

export default AddRoute;
