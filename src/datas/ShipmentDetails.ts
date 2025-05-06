import { ShipmentDetails } from "../models/ShipmentDetail";
export const shipmentDetails: ShipmentDetails[] = [
    {
        shipment_id: "SHP001",
        order_id: "ORD001",
        vehicle_id: "VEH001",
        route_id: "RTE001",
        departure_time: new Date("2025-05-01T10:00:00Z"),
        arrival_time: new Date("2025-05-03T10:00:00Z"),
    },
    {
        shipment_id: "SHP002",
        order_id: "ORD002",
        vehicle_id: "VEH002",
        route_id: "RTE002",
        departure_time: new Date("2025-04-20T12:00:00Z"),
        arrival_time: new Date("2025-04-23T12:00:00Z"),
    },
    {
        shipment_id: "SHP003",
        order_id: "ORD003",
        vehicle_id: "VEH003",
        route_id: "RTE003",
        departure_time: new Date("2025-03-15T08:00:00Z"),
        arrival_time: new Date("2025-03-16T08:00:00Z"),
    },
    {
        shipment_id: "SHP004",
        order_id: "ORD004",
        vehicle_id: "VEH004",
        route_id: "RTE004",
        departure_time: new Date("2025-04-25T09:00:00Z"),
        arrival_time: new Date("2025-04-28T09:00:00Z"),
    },
    {
        shipment_id: "SHP005",
        order_id: "ORD005",
        vehicle_id: "VEH005",
        route_id: "RTE005",
        departure_time: new Date("2025-05-04T07:00:00Z"),
        arrival_time: new Date("2025-05-06T07:00:00Z"),
    },
];
