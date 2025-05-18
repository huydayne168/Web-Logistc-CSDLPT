import { useState } from "react";
import RegionCardCustom from "./RegionCardCustom";
import styles from "./dashboard.module.css";

interface RegionData {
    serverName: string;
    linkName: string;
    location: string;
    id: string;
}

export default function CustomRegionPage() {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

    const regions: RegionData[] = [
        {
            serverName: "QUANGHUNG2024\\GLOBAL_HUB",
            linkName: "LINK_GLOBAL",
            location: "MÁY CHỦ",
            id: "global",
        },
        {
            serverName: "DESKTOP-IM7KUML\\EU_SERVER",
            linkName: "LINK_EU",
            location: "EU",
            id: "eu",
        },
        {
            serverName: "DESKTOP-K4REU6F\\AU_SERVER",
            linkName: "LINK_AU",
            location: "AU",
            id: "au",
        },
        {
            serverName: "HUYDN\\AS_SERVER",
            linkName: "LINK_AS",
            location: "AS",
            id: "as",
        },
        {
            serverName: "ADMIN\\AF_SERVER",
            linkName: "LINK_AF",
            location: "AF",
            id: "af",
        },
        {
            serverName: "ADMIN\\ME_SERVER",
            linkName: "LINK_ME",
            location: "ME",
            id: "me",
        },
        {
            serverName: "ADMIN\\SA_SERVER",
            linkName: "LINK_SA",
            location: "SA",
            id: "sa",
        },
        {
            serverName: "ADMIN\\NA_SERVER",
            linkName: "LINK_NA",
            location: "NA",
            id: "na",
        },
    ];

    const handleSelectRegion = (location: string) => {
        setSelectedRegion(location);
    };

    return (
        <div className={styles["container"]}>
            <h1 className={styles["title"]}>Chọn Region</h1>

            <div className={styles["region-grid"]}>
                {regions.map((region) => (
                    <RegionCardCustom
                        key={region.location}
                        serverName={region.serverName}
                        linkName={region.linkName}
                        location={region.location}
                        isSelected={selectedRegion === region.location}
                        onSelect={() => handleSelectRegion(region.location)}
                    />
                ))}
            </div>

            {selectedRegion && (
                <div className={styles["selected-message"]}>
                    <p>
                        Đã chọn region: <strong>{selectedRegion}</strong>
                    </p>
                </div>
            )}
        </div>
    );
}
