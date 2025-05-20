import { useState } from "react";
import RegionCardCustom from "./RegionCardCustom";
import styles from "./dashboard.module.css";
import regions from "../../datas/Regions";
import { useAppDispatch } from "../../hooks/useStore";
import { regionActions } from "../../store/store";
import RegionData from "../../models/Region";

export default function CustomRegionPage() {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const dispatch = useAppDispatch();

    const handleSelectRegion = (region: RegionData) => {
        setSelectedRegion(region.location);
        dispatch(regionActions.setRegionState(region));
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
                        onSelect={() => handleSelectRegion(region)}
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
