import { Customs } from "../models/Custom";
export const customs: Customs[] = [
    {
        customs_id: "CUS001",
        country_code: "VN",
        regulation: "Requires inspection",
        processing_time: 24,
    },
    {
        customs_id: "CUS002",
        country_code: "US",
        regulation: "Fast-track available",
        processing_time: 12,
    },
    {
        customs_id: "CUS003",
        country_code: "CN",
        regulation: "Standard procedure",
        processing_time: 48,
    },
    {
        customs_id: "CUS004",
        country_code: "DE",
        regulation: "Requires documentation",
        processing_time: 36,
    },
    {
        customs_id: "CUS005",
        country_code: "RU",
        regulation: "Additional tax",
        processing_time: 60,
    },
];
