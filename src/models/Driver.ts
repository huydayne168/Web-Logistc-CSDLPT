export type Driver = {
    driver_id: string;
    vehicle_id: string;
    name: string;
    nationality: string;
    intl_license: "Yes" | "No";
    visa_status: "Valid" | "Expired" | string;
};
