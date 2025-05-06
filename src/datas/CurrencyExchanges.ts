import { CurrencyExchange } from "../models/CurrencyExchange";
export const currencies: CurrencyExchange[] = [
    {
        currency_id: "CUR001",
        currency_code: "USD",
        exchange_rate: 1.0,
        last_updated: new Date("2025-05-05"),
    },
    {
        currency_id: "CUR002",
        currency_code: "EUR",
        exchange_rate: 0.91,
        last_updated: new Date("2025-05-05"),
    },
    {
        currency_id: "CUR003",
        currency_code: "JPY",
        exchange_rate: 134.5,
        last_updated: new Date("2025-05-05"),
    },
];
