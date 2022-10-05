import axiosInstance, { axiosPrivate } from "../../api/axios";

const registerUser = async (user) => {
  const response = await axiosInstance.post("/", user);
  return response?.data;
};

const logoutUser = async () => {
  const response = await axiosPrivate.get("/users/logout");
  return response?.data;
};

const loginUser = async (user) => {
  const response = await axiosInstance.post("/login", user);

  return response?.data;
};

const authService = {
  registerUser,
  logoutUser,
  loginUser,
};

export default authService;
