import { App } from "../constants";
import { httpService } from "./httpService";

const name = 'Proof';

async function getProofs() {
    return await httpService.get('/' + name)
        .then((res) => {
            if (App.DEV) console.table(res.data);

            return res;
        }).catch((e) => {
            console.log(e);
        });
}

async function deleteProof(id) {
    const reply = await httpService.delete('/' + name + '/' + id)
        .then(() => {
            return { ok: true, message: 'Proof deleted' };
        }).catch((e) => {
            console.log(e);
            return { ok: true, message: e.response.data };
        });
    return reply;
}

async function createProof(entity) {

    const reply = await httpService.post('/' + name, entity)
        .then(() => {
            console.log('Input ' + name);
            return { ok: true, message: 'Added ' + name }
        }).catch((error) => {
            console.log(error + entity);
            return { ok: false, message: error.response.data };
        });
    return reply;
}

async function getById(id) {
    return await httpService.get('/' + name + '/' + id)
        .then((res) => res)
        .catch((e) => {
            console.log(e);
            return { ok: false, message: e.response.data };
            });
}

async function updateProof(id, entity) {
    const reply = await httpService.put('/' + name + '/' + id, entity)
        .then(() => {
            return { ok: true, message: 'Proof updated' };
        }).catch((error) => {
            return { ok: false, message: error.response.data };
        });

    return reply;
}

export default {
    getProofs,
    deleteProof,
    createProof,
    getById,
    updateProof
}