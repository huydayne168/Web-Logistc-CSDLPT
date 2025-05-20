import { useAppSelector } from "./useStore";
import http from "../utils/http";
const useHttp = () => {
    const currentRegion = useAppSelector((state) => state.region.id);
    http.defaults.baseURL += `/${currentRegion}`;
    return http;
};

export default useHttp; // this hook is used to fetch public route
