import axios from "axios";

const baseURL = "https://iestilus.herokuapp.com";

const api = axios.create({ baseURL });

export default api;
