export type Route = {
    route_id: string;
    station_from: string;
    station_to: string;
    distance: number;
    estimated_time: number;
    type: "Domestic" | "International" | string;
};
