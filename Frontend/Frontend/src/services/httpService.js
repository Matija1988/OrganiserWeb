import axios from "axios";

export const httpService = axios.Create({
    baseURL: 'https://https://matijapavkovic-001-site1.itempurl.com/api/v1',
    headers:{
        'Content-Type' : 'application/json'
    }
});