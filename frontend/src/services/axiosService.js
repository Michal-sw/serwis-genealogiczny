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

const getGlobalChat = async () => {
  return axiosInstance.get(`/chat`);
}

const searchUserByTreeMembers = async (input) => {
  const inputAsString = input.reduce((prev, curr) => prev ? `${prev},${curr}` : curr, "");
  return axiosInstance.get(`/users?treeMembers=${inputAsString}`);
}

const getUserById = async (userId) => {
  return axiosInstance.get(`/users/${userId}`);
}

const getUserTreeById = async (userId) => {
  return axiosInstance.get(`/users/${userId}/tree`);
}

const addTreeRelation = async (userId, values) => {
  return axiosInstance.post(`/users/${userId}/tree/add`, values);
}

const performCopy = async (userId, values) => {
  return axiosInstance.post(`/users/${userId}/tree/copy`, values);
}

const addRoot = async (userId, values) => {
  return axiosInstance.post(`/users/${userId}/tree/root`, values);
}


const deleteMember = async (userId, memberId) => {
  return axiosInstance.delete(`/users/${userId}/tree/${memberId}`);
}

export {
    axiosInstance,
    refreshToken,
    login,
    signIn,
    logout,
    getGlobalChat,
    searchUserByTreeMembers,
    getUserById,
    getUserTreeById,
    addTreeRelation,
    deleteMember,
    addRoot,
    performCopy
};