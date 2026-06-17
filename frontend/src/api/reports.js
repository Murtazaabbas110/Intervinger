import axiosInstance from "../lib/axios";

export const getReports = async () => {
  const { data } = await axiosInstance.get("/reports");
  return data;
};