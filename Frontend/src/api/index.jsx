import axios from 'axios';

export const BASE_URL = 'https://localhost:7160/'

export const ENDPOINTS = {
    member: 'member'
}

export const createAPIEndpoint = endpoint => {
    let url = BASE_URL + 'api/v1/' + endpoint + '/';

    return {
        fetch: () => axios.get(url),
        fetchById: id => axios.get(url + id),
        post: newRecord => axios.post(url, newRecord),
        put: (id, updatedRecord) => axios.put(url + id, updatedRecord),
        delete: id => axios.delete(url + id),
    }
}