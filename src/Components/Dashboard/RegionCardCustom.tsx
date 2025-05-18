import styles from "./regionCustomCard.module.css";

interface RegionCardProps {
    serverName: string;
    linkName: string;
    location: string;
    isSelected: boolean;
    onSelect: () => void;
}

const RegionCardCustom = ({
    serverName,
    linkName,
    location,
    isSelected,
    onSelect,
}: RegionCardProps) => {
    return (
        <div
            className={`${styles["region-card"]} ${
                isSelected ? styles["selected"] : ""
            }`}
            onClick={onSelect}
        >
            {isSelected && (
                <div className={styles["check-icon"]}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
            )}

            <div className={styles["region-content"]}>
                <div className={styles["region-location"]}>{location}</div>
                <div className={styles["region-server"]} title={serverName}>
                    {serverName}
                </div>
                <div className={styles["region-link"]}>{linkName}</div>
            </div>
        </div>
    );
};

export default RegionCardCustom;
