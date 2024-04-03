import { App } from "../constants";
import { handleSuccess, httpService, processError } from "./httpService";

const name = 'Proof';

async function getProofs() {
    return await httpService.get('/' + name)
    .then((res) => { return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function deleteProof(id) {
    return await httpService.delete('/' + name + '/' + id)
    .then((res) => { return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function createProof(entity) {
    return await httpService.post('/'+ name, entity)
    .then((res)=>{return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function getById(id) {
    return await httpService.get('/' + name + '/' + id)
    .then((res)=>{return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function updateProof(id, entity) {
    return await httpService.put('/'+ name +'/' + id, entity)
    .then((res)=> {return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function getPagination(page, condition) {
    return await httpService.get('/'+name+'/'+'/paginate/'+ page + '?condition=' + condition)
    .then((res)=>{return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function uploadFile(id, file, config) {   
    return await httpService.patch('/' + name + '/' + id, file, config)
    .then((res)=>{return handleSuccess(res);}).catch((e)=>{return processError(e);});

}

export default {
    getProofs,
    deleteProof,
    createProof,
    getById,
    updateProof,
    getPagination,
    uploadFile
}