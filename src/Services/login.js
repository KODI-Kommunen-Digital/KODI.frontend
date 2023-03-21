import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8002'
  });

export async function login(credentials) {
    return instance.post(`/users/login`, credentials);
}