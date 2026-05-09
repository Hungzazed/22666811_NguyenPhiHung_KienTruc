import axios from "axios";

const gatewayBaseURL = import.meta.env.VITE_API_GATEWAY_URL;

export const userApi = axios.create({ baseURL: gatewayBaseURL });
export const foodApi = axios.create({ baseURL: gatewayBaseURL });
export const orderApi = axios.create({ baseURL: gatewayBaseURL });
export const paymentApi = axios.create({ baseURL: gatewayBaseURL });

export function setAuthToken(token) {
  const authHeader = token ? `Bearer ${token}` : "";
  userApi.defaults.headers.common.Authorization = authHeader;
  foodApi.defaults.headers.common.Authorization = authHeader;
  orderApi.defaults.headers.common.Authorization = authHeader;
  paymentApi.defaults.headers.common.Authorization = authHeader;
}
