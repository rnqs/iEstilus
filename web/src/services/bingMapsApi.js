import axios from "axios";

const bingMapsApi = axios.create({
  baseURL: "https://dev.virtualearth.net/REST/v1/Locations",
});

const apiKey =
  "AkcZW2FBs8-snkJ-dQ_8D7BXNkXH5wmMC57HhXZoT_peW4DZvW83f5ou9J5u2zWP";

export { bingMapsApi, apiKey };
