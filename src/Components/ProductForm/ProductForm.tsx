import React, { useState } from "react";
import styles from "./product-form.module.css";

import { Product } from "../../models/product";

import { BeatLoader } from "react-spinners";

import { Alert } from "antd";
import regions from "../../datas/Regions";
import { useAppSelector } from "../../hooks/useStore";

const ProductForm: React.FC<{
    errMess?: boolean;
    product?: Product;
    handleProductFn: Function;
}> = ({ errMess, product, handleProductFn }) => {
    const isLoading = useAppSelector((state) => state.loading);

    // component state:
    const [name, setName] = useState(product?.name || "");
    const currentRegion = useAppSelector((state) => state.region.id);
    const [id, setId] = useState("");
    const [address, setAddress] = useState("");
    const [otherRegion, setOtherRegion] = useState<string>(currentRegion);
    const [country, setCountry] = useState<string>("");

    return (
        <div className={styles.productFormContainer}>
            <div className={styles.heading}>
                {product ? "Edit Product" : "Add New Station"}
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
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.controls}>
                        <label htmlFor="name">Country</label>
                        <input
                            type="text"
                            name="country"
                            id="country"
                            value={country}
                            onChange={(e) => {
                                setCountry(e.target.value);
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
                    <div className={styles.controls}>
                        <label htmlFor="price">Address</label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            min={0}
                            value={address}
                            onChange={(e) => {
                                setAddress(e.target.value);
                            }}
                        />
                    </div>

                    <button
                        className={`${styles.sendBtn} btn btn-success btn-lg`}
                        onClick={(e) => {
                            e.preventDefault();
                            console.log({
                                station_id: id,
                                station_name: name,
                                address,
                                country_id: otherRegion,
                            });
                            handleProductFn({
                                station_id: id,
                                station_name: name,
                                address,
                                country_id: country.trim().toUpperCase(),
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

export default ProductForm;
