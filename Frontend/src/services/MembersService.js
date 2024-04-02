import { handleSuccess, httpService, processError } from "./httpService";

const name = 'Member';

async function getMembers() {
    return await httpService.get('/' + name)
        .then((res) => { return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function deleteMember(id) {
    return await httpService.delete('/' + name + '/' + id)
        .then((res) => { return handleSuccess(res);}).catch((e)=>{return processError(e);});
}
   
async function createMember(entity) {
    return await httpService.post('/' + name, entity)
        .then((res) => { return handleSuccess(res);}).catch((e)=>{return processError(e);});
}


async function getById(id)  {
    return await httpService.get('/' + name + '/' + id)
    .then((res)=>{return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function updateMember(id, entity) {
    return await httpService.put('/'+ name +'/' + id, entity)
    .then((res)=> {return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function searchMemberByName(input) {
    return await httpService.get('/' + name + '/SearchByName/'+ input)
    .then((res)=>{return handleSuccess(res);}).catch((e)=>{return processError(e)});
}

export default {
    getMembers,
    deleteMember,
    createMember,
    getById,
    updateMember,
    searchMemberByName
}
