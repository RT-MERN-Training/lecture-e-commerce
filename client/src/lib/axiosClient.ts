import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://dummyjson.com",
  headers: {
    "Content-Type": "application/json",
  },
});

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

axiosClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    await wait(500);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosClient;
