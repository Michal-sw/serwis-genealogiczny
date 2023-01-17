import axios from "axios";

const apiPath = import.meta.env.VITE_API_ENDPOINT || "http://127.0.0.1:8080";

const axiosInstance = axios.create({
    baseURL: apiPath,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

const refreshToken = async () => {
  return axiosInstance.post(`/users/refresh`);
};

const login = async (values) => {
  console.log(values);
  return axiosInstance.post(`/users/login`, values);
};

const logout = async () => {
  return axiosInstance.post(`/users/logout`);
};

export {
    axiosInstance,
    refreshToken,
    login,
    logout
};