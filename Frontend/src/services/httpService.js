import axios from 'axios';
import { AxiosError } from 'axios';
import { App } from '../constants';

export const httpService = axios.create({
    baseURL: App.URL + '/api/v1',
    headers: { 'Content-Type': 'application/json' }
});

export function handleSuccess(res) {
    if (App.DEV) console.table(res.data);
    return { ok: true, data: res.data };
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


