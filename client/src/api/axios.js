import axios from "axios";

const API_URL_AUTH = "api/users";
const API_URL_RESOURCE = "/api";

export default axios.create({
  baseURL: API_URL_AUTH,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// axios instance for requesting resources
export const axiosPrivate = axios.create({
  baseURL: API_URL_RESOURCE,
  withCredentials: true, //include cookies (REFRESH JWT cookie)
  headers: {
    "Content-Type": "application/json",
  },
});
