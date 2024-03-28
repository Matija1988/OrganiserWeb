import { App } from "../constants";
import { handleSuccess, httpService, processError } from "./httpService";

const name = 'Activity';

async function get() {
    return await httpService.get('/' + name)
        .then((res) => { return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function deleteActivities(id) {
 return await httpService.delete('/' + name + '/' + id)
    .then((res)=>{return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function create(entity) {
 return await httpService.post('/'+ name, entity)
    .then((res)=>{return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function getById(id) {
    return await httpService.get('/' + name + '/' + id)
    .then((res)=>{return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function updateActivity(id, entity) {
   return await httpService.put('/'+name+'/' + id, entity)
   .then((res)=> {return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function getActivityMembers(id) {
    return await httpService.get('/' + name + '/Members' + id)
    .then((res)=>{ return handleSuccess(res);}).catch((e)=> {return processError(e);});
}

export default {
    get,
    deleteActivities,
    create,
    getById,
    updateActivity,
    getActivityMembers
}
