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
  return axiosInstance.post(`/users/login`, values);
};

const signIn = async (values) => {
  return axiosInstance.post(`/users/signin`, values);
};

const logout = async () => {
  return axiosInstance.post(`/users/logout`);
};

const searchUserByTreeMembers = async (input) => {
  const inputAsString = input.reduce((prev, curr) => prev ? `${prev},${curr}` : curr, "");
  return axiosInstance.get(`/users?treeMembers=${inputAsString}`);
}

export {
    axiosInstance,
    refreshToken,
    login,
    signIn,
    logout,
    searchUserByTreeMembers
};