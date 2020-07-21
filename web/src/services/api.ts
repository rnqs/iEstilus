import axios from "axios";

const baseURL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:3030"
    : "https://iestilus.herokuapp.com";

const api = axios.create({ baseURL });

export default api;

export interface Establishment {
  _id: number;
  name: string;
  description: string;
  photo_url: string;
  phone_number: string;
  whatsapp_available: boolean;
  address: string;
  services: Service[];
  coordinate: LatLng;
}

export interface Service {
  _id: number;
  name: string;
  price: number;
  photo_url?: string;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}
