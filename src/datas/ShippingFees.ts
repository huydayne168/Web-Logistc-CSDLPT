import { ShippingFee } from "../models/ShippingFee";
export const shippingFees: ShippingFee[] = [
    {
        fee_id: "FEE001",
        route_id: "RTE001",
        currency_id: "CUR001",
        base_fee: 100,
        tax_rate: 0.1,
        total_fee: 110,
    },
    {
        fee_id: "FEE002",
        route_id: "RTE002",
        currency_id: "CUR002",
        base_fee: 200,
        tax_rate: 0.2,
        total_fee: 240,
    },
    {
        fee_id: "FEE003",
        route_id: "RTE003",
        currency_id: "CUR001",
        base_fee: 150,
        tax_rate: 0.1,
        total_fee: 165,
    },
    {
        fee_id: "FEE004",
        route_id: "RTE004",
        currency_id: "CUR003",
        base_fee: 300,
        tax_rate: 0.15,
        total_fee: 345,
    },
    {
        fee_id: "FEE005",
        route_id: "RTE005",
        currency_id: "CUR001",
        base_fee: 250,
        tax_rate: 0.1,
        total_fee: 275,
    },
];
