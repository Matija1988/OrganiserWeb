import axios from 'axios';
import { AxiosError } from 'axios';
import { App } from '../constants';

export const httpService = axios.create({
    baseURL: App.URL + '/api/v1',
    headers: { 'Content-Type': 'application/json' }
});

httpService.interceptors.request.use((config)=> {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('Bearer');
    return config; 
});

httpService.interceptors.response.use(
    (response) =>response, 
    (error) => {
        if(error.response.status === 401) {
            localStorage.setItem('Bearer', '');
            window.location.href = '/';
        } 
        return Promise.reject(error);
    }
);

export async function read(name) {
    return await httpService.get('/' + name)
        .then((res) => { return handleSuccess(res); }).catch((e) => { return processError(res); })
}

export async function getByID(name, id) {
    return await httpService.get('/' + name + '/' + id)
        .then((res) => { return handleSuccess(res); }).catch((e) => { return processError(res); })
}

export async function create(name, entity) {
    return await httpService.post('/' + name, entity)
        .then((res) => { return handleSuccess(res); }).catch((e) => { return processError(res); })
}

export async function update(name, id, entity) {
    return await httpService.put('/' + name + '/' + id, entity)
        .then((res) => { return handleSuccess(res); }).catch((e) => { return processError(res); })
}

export async function remove(name, id) {
    return await httpService.delete('/' + name + '/' + id)
        .then((res) => { return handleSuccess(res); }).catch((e) => { return processError(e); })
}

export function handleSuccess(res) {
    if (App.DEV) console.table(res.data);
    return { ok: true, data: res.data };
}

export function handeSuccesfulDelete(res) {
    if (App.DEV) console.table(res.data);
    return { ok: true, data: [generateMessage('Message', res.data)] };
}


export function processError(e) {

    if (!e.reponse) {
        return { ok: false, data: [generateMessage('Network issue', 'server unresponsive')] };
    }

    if (e.code == AxiosError.ERR_NETWORK) {
        return { ok: false, data: [generateMessage('Network issue', 'Try again later')] };
    }

    switch (e.reponse.status) {

        case 503:
            return { ok: false, data: [generateMessage('Server issue', e.response.data)] };

        case 403:
            return { ok: false, data: [generateMessage('Action denied', e.response.data)]};

        case 400:
            if (typeof (e.response.data.errors) !== 'undefined') {
                return handle400(e.response.data.errors);
            }
            return { ok: false, data: [generateMessage('Data mismatch', e.reponse.data)] };
    }
    return { ok: false, data: e }

}

function handle400(e) {
    let message = [];
    for (const key in e) {
        message.push(generateMessage(key, e[key][0]));
    }
    return { ok: false, data: message };
}

function generateMessage(property, message) {
    return { property: property, message: message };
}

export function getAlertMessages(data) {
    let messages = '';
    if (Array.isArray(data)) {
        for (const p of data) {
            messages += p.property + ": " + p.message + "\n";
        }
    } else {
        messages = data;
    }
    return messages;
}


