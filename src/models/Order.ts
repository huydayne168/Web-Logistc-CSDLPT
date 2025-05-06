export type Order = {
    order_id: string;
    customer_id: string;
    station_id: string;
    customs_id: string;
    status: "Created" | "In Transit" | "Delivered";
    created_at: Date;
    expected_delivery: Date;
    region_code: "NA" | "EU" | "ASIA" | string;
    total_weight: number;
};
