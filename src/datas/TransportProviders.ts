import { TransportProvider } from "../models/TransportProvider";
export const providers: TransportProvider[] = [
    {
        provider_id: "PRV001",
        provider_name: "FedEx",
        country: "US",
        type: "International",
    },
    {
        provider_id: "PRV002",
        provider_name: "DHL",
        country: "DE",
        type: "International",
    },
    {
        provider_id: "PRV003",
        provider_name: "Maersk",
        country: "DK",
        type: "International",
    },
    {
        provider_id: "PRV004",
        provider_name: "Vietnam Post",
        country: "VN",
        type: "Local",
    },
    {
        provider_id: "PRV005",
        provider_name: "Japan Freight",
        country: "JP",
        type: "Local",
    },
];
