import { App } from "../constants";
import { handleSuccess, httpService, processError } from "./httpService";

const name = 'Project';

async function getProjects() {
    return await httpService.get('/' + name)
    .then((res) => { return handleSuccess(res);}).catch((e)=>{return processError(e);});

}

async function addProject(entity) {
    return await httpService.post('/'+ name, entity)
    .then((res)=>{return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function changeProject(id, entity) {
    return await httpService.put('/'+ name +'/' + id, entity)
    .then((res)=> {return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function deleteProject(id) {
    return await httpService.delete('/' + name + '/' + id)
    .then((res) => { return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function getById(id) {
    return await httpService.get('/' + name + '/' + id)
    .then((res)=>{return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

async function searchProjectByName(input) {
    return await httpService.get('/Projects/SearchByName/' + input)
        .then((res) => {
            if (App.DEV) console.table(res.data);
            return res;
        }).catch((e) => {
            console.log(e);
            return { message: e };
        });
}

async function listProjectActivities(id) {
    return await httpService.get('/Activity/listprojectactivities/' + id)
    .then((res) => {
        if (App.DEV) console.table(res.data);
        return res;
    }).catch((e) => {
        console.log(e);
        return { message: e };
    });
}




export default { getProjects, addProject, changeProject, deleteProject, getById, searchProjectByName, listProjectActivities};