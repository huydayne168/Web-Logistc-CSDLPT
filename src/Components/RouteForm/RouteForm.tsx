import React, { useState } from "react";
import styles from "./product-form.module.css";

import { Product } from "../../models/product";

import { BeatLoader } from "react-spinners";

import { Alert } from "antd";
import regions from "../../datas/Regions";
import { useAppSelector } from "../../hooks/useStore";

const RouteForm: React.FC<{
    errMess?: boolean;
    product?: Product;
    handleProductFn: Function;
}> = ({ errMess, product, handleProductFn }) => {
    const isLoading = useAppSelector((state) => state.loading);

    // component state:
    const [name, setName] = useState(product?.name || "");
    const currentRegion = useAppSelector((state) => state.region.id);
    const [id, setId] = useState("");
    const [otherRegion, setOtherRegion] = useState<string>(currentRegion);
    const [stationFrom, setStationFrom] = useState<string>("");
    const [stationTo, setStationTo] = useState<string>("");
    const [distance, setDistance] = useState<string>("");
    const [estimateTime, setEstimateTime] = useState<string>("");
    const [type, setType] = useState<string>("");

    return (
        <div className={styles.productFormContainer}>
            <div className={styles.heading}>
                {product ? "Edit Product" : "Add Route"}
                {isLoading ? <BeatLoader /> : ""}
            </div>
            <div className={styles["product-form"]}>
                <form action="#">
                    <div className={styles.controls}>
                        <label htmlFor="name">ID</label>
                        <input
                            type="text"
                            name="id"
                            id="id"
                            value={id}
                            onChange={(e) => {
                                setId(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.controls}>
                        <label htmlFor="name">Station From</label>
                        <input
                            type="text"
                            name="station_from"
                            id="station_from"
                            value={stationFrom}
                            onChange={(e) => {
                                setStationFrom(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.controls}>
                        <label htmlFor="name">Station To</label>
                        <input
                            type="text"
                            name="station_to"
                            id="station_to"
                            value={stationTo}
                            onChange={(e) => {
                                setStationTo(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.controls}>
                        <label htmlFor="name">Distance</label>
                        <input
                            type="number"
                            name="distance"
                            id="distance"
                            value={distance}
                            onChange={(e) => {
                                setDistance(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.controls}>
                        <label htmlFor="name">Estimate time</label>
                        <input
                            type="number"
                            name="estimate_time"
                            id="estimate_time"
                            value={estimateTime}
                            onChange={(e) => {
                                setEstimateTime(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.controls}>
                        <label htmlFor="name">Type</label>
                        <input
                            type="text"
                            name="type"
                            id="type"
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.controls}>
                        <label htmlFor="category">Region</label>
                        <select
                            name="category"
                            id="category"
                            className="form-select"
                            onChange={(e) => {
                                setOtherRegion(
                                    regions.filter(
                                        (c) => c.id === e.target.value
                                    )[0].id
                                );
                            }}
                            defaultValue={otherRegion}
                        >
                            {otherRegion ? (
                                <option value={otherRegion}>
                                    {otherRegion.toUpperCase()}
                                </option>
                            ) : (
                                <option value={""} hidden>
                                    --Choose food category--
                                </option>
                            )}
                            {regions[0] &&
                                regions.map((_region) => {
                                    return (
                                        <option
                                            hidden={otherRegion === _region.id}
                                            key={_region.id}
                                            value={_region.id}
                                        >
                                            {_region.id.toUpperCase()}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>
                    <button
                        className={`${styles.sendBtn} btn btn-success btn-lg`}
                        onClick={(e) => {
                            e.preventDefault();
                            console.log({
                                route_id: id,
                                station_from: stationFrom,
                                station_to: stationTo,
                                distance,
                                estimated_time: estimateTime,
                                type,
                                otherRegion,
                            });
                            handleProductFn({
                                route_id: id,
                                station_from: stationFrom,
                                station_to: stationTo,
                                distance,
                                estimated_time: estimateTime,
                                type,
                                otherRegion,
                            });
                        }}
                    >
                        {product ? "Edit" : "Add"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RouteForm;
