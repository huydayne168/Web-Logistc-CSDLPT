export type TransportProvider = {
    provider_id: string;
    provider_name: string;
    country: string;
    type: "Local" | "International" | string;
};
