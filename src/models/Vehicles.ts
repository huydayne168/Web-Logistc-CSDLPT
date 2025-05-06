export type Vehicle = {
    vehicle_id: string;
    provider_id: string;
    station_id: string;
    type: "Truck" | "Ship" | "Plane" | string;
    capacity: number;
    registration_country: string;
};
