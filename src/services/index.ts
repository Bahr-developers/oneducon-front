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

customAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 406) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("storeId");
            window.location.href = "/";
        }
        
        return Promise.reject(error);
    }
);

export default customAxios;