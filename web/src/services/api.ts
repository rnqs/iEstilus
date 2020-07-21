import axios from "axios";

const baseURL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:3030"
    : "https://iestilus.herokuapp.com";

const api = axios.create({ baseURL });

export default api;
