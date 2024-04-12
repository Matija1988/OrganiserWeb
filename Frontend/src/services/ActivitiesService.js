import { App } from "../constants";

import { handleSuccess, httpService, processError,read, getByID, create, update, remove } from "./httpService";

const name = 'Activity';

async function getActivityMembers(id) {
    return await httpService.get('/' + name + '/Members/' + id)
    .then((res)=>{ return handleSuccess(res);}).catch((e)=> {return processError(e);});
}

async function assignMemberToActivity(id, memberId) {
    return await httpService.post('/'+name+'/'+id+'/add/'+memberId)
    .then((res)=> {return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function removeMemberFromActivity(id, memberId) {
    return await httpService.delete('/' + name+ '/' + id+'/delete/' + memberId)
    .then((res)=>{return handleSuccess(res);}).catch((e)=> {return processError(e);});
}

async function getPagination(page, condition) {
    return await httpService.get('/' + name + '/getPagination/' + page + '?condition=' + condition)
        .then((res) => { return handleSuccess(res); }).catch((e) => { return processError(e); });
}

export default {
    read,
    remove,
    create,
    getByID,
    update,
    getActivityMembers,
    assignMemberToActivity,
    removeMemberFromActivity,
    getPagination
}
