import axios from "axios";
import { config } from "./config";

export const axiosInstance = axios.create({
    baseURL: `https://port-0-goms-backend-v2-12fhqa2bln49rbi0.sel5.cloudtype.app`,
    headers: {
        "Discord-Client-Token": config.discordGomsToken
    }
})
