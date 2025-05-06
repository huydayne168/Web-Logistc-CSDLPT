import { Route } from "../models/Route";
export const routes: Route[] = [
    {
        route_id: "RTE001",
        station_from: "STA001",
        station_to: "STA002",
        distance: 500,
        estimated_time: 48,
        type: "Domestic",
    },
    {
        route_id: "RTE002",
        station_from: "STA002",
        station_to: "STA003",
        distance: 1200,
        estimated_time: 72,
        type: "International",
    },
    {
        route_id: "RTE003",
        station_from: "STA003",
        station_to: "STA004",
        distance: 800,
        estimated_time: 36,
        type: "Domestic",
    },
    {
        route_id: "RTE004",
        station_from: "STA004",
        station_to: "STA001",
        distance: 1500,
        estimated_time: 96,
        type: "International",
    },
    {
        route_id: "RTE005",
        station_from: "STA001",
        station_to: "STA003",
        distance: 1000,
        estimated_time: 60,
        type: "International",
    },
];
