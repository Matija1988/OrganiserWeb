import { App } from "../constants";
import { handleSuccess, httpService, processError,read, getByID, create, update, remove } from "./httpService";

const name = 'Proof';

async function getPagination(page, condition) {
    return await httpService.get('/' + name + '/getPagination/' + page + '?condition=' + condition)
        .then((res) => { return handleSuccess(res); }).catch((e) => { return processError(e); });
}

async function uploadFile(id, file, config) {
    return await httpService.patch('/' + name + '/' + id, file, config)
        .then((res) => { return handleSuccess(res); }).catch((e) => { return processError(e); });

}

async function downloadFile(id) {
    return await httpService.get('/' + name + '/getFile/' + id, {responseType: 'blob'} )
        .then((res) => { return handleSuccess(res); })
        .catch((e) => { return processError(e); });
}

export default {
    read,
    remove,
    create,
    getByID,
    update,
    getPagination,
    uploadFile,
    downloadFile
}