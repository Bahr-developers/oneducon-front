import axios from "axios";
import { BASE_URL_SERVER } from "../constants";

const customAxios = axios.create({
    baseURL: BASE_URL_SERVER,
    timeout: 10000
});

customAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);



export default customAxios;