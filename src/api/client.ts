import axios from "axios";

export const client = axios.create({
  baseURL: 'https://scheduler.int.adler.local/api/v1',
  withCredentials: true,
})

