import React, { useState } from "react";
import styles from "./product-form.module.css";

import { Product } from "../../models/product";

import { BeatLoader } from "react-spinners";

import { Alert } from "antd";
import regions from "../../datas/Regions";
import { useAppSelector } from "../../hooks/useStore";

const CustomerForm: React.FC<{
    errMess?: boolean;
    product?: Product;
    handleProductFn: Function;
}> = ({ errMess, product, handleProductFn }) => {
    const isLoading = useAppSelector((state) => state.loading);

    // component state:
    const currentRegion = useAppSelector((state) => state.region.id);
    const [id, setId] = useState("");
    const [address, setAddress] = useState("");
    const [otherRegion, setOtherRegion] = useState<string>(currentRegion);
    const [customerId, setCustomerId] = useState("");
    const [stationId, setStationId] = useState("");
    const [customId, setCustomId] = useState("");
    const [statusType, setStatusType] = useState("");

    const [createdAt, setCreatedAt] = useState("");
    const [amount, setAmount] = useState("");
    const [expectedDelivery, setExpectedDelivery] = useState("");
    const [totalWeight, setTotalWeight] = useState("");

    return (
        <div className={styles.productFormContainer}>
            <div className={styles.heading}>
                {product ? "Edit Product" : "Add Order"}
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
                        <label htmlFor="name">Customer Id</label>
                        <input
                            type="text"
                            name="customer_id"
                            id="customer_id"
                            value={customerId}
                            onChange={(e) => {
                                setCustomerId(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.controls}>
                        <label htmlFor="name">Station Id</label>
                        <input
                            type="text"
                            name="station_id"
                            id="station_id"
                            value={stationId}
                            onChange={(e) => {
                                setStationId(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.controls}>
                        <label htmlFor="name">Custom Id</label>
                        <input
                            type="text"
                            name="custom_id"
                            id="custom_id"
                            value={customId}
                            onChange={(e) => {
                                setCustomId(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.controls}>
                        <label htmlFor="name">Status</label>
                        <input
                            type="text"
                            name="status"
                            id="status"
                            value={statusType}
                            onChange={(e) => {
                                setStatusType(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.controls}>
                        <label htmlFor="name">Created At</label>
                        <input
                            type="text"
                            name="created_at"
                            id="created_at"
                            value={createdAt}
                            onChange={(e) => {
                                setCreatedAt(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.controls}>
                        <label htmlFor="name">Amount</label>
                        <input
                            type="text"
                            name="amount"
                            id="amount"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.controls}>
                        <label htmlFor="price">Expected Delivery</label>
                        <input
                            type="text"
                            name="expected_delivery"
                            id="expected_delivery"
                            min={0}
                            value={expectedDelivery}
                            onChange={(e) => {
                                setExpectedDelivery(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.controls}>
                        <label htmlFor="price">Total Weight</label>
                        <input
                            type="text"
                            name="total_weight"
                            id="total_weight"
                            min={0}
                            value={totalWeight}
                            onChange={(e) => {
                                setTotalWeight(e.target.value);
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
                                id,
                                customerId,
                                stationId,
                                customId,
                                statusType,
                                createdAt,
                                amount,
                                expectedDelivery,
                                totalWeight,
                            });
                            handleProductFn({
                                order_id: id,
                                station_id: stationId,
                                customer_id: customerId,
                                customs_id: customId,
                                status: statusType,
                                created_at: createdAt,
                                amount,
                                expected_delivery: expectedDelivery,
                                total_weight: totalWeight,
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

export default CustomerForm;
