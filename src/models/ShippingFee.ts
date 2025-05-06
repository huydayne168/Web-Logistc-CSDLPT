export type ShippingFee = {
    fee_id: string;
    route_id: string;
    currency_id: string;
    base_fee: number;
    tax_rate: number;
    total_fee: number;
};
