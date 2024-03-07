import axios from 'axios';

export const httpService = axios.create({
    baseURL: 'https://matijapavkovic-001-site1.itempurl.com/api/v1',
    headers:{'Content-Type': 'application/json'}
});

// export const ENDPOINTS = {
//     member: 'member'
// }

// export const createAPIEndpoint = endpoint => {
//     let url = httpService + endpoint + '/';

//     return {
//         fetch: () => axios.get(url),
//         fetchById: id => axios.get(url + id),
//         post: newRecord => axios.post(url, newRecord),
//         put: (id, updatedRecord) => axios.put(url + id, updatedRecord),
//         delete: id => axios.delete(url + id),
//     }
// }