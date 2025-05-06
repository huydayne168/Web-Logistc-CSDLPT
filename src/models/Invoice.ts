export type Invoice = {
    invoice_id: string;
    order_id: string;
    currency_id: string;
    total_amount: number;
    customs_fee: number;
    tax_amount: number;
    issue_date: Date;
};
