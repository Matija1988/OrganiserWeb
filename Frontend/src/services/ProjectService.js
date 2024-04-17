import { App } from "../constants";
import { handleSuccess, httpService, processError,read, getByID, create, update, remove } from "./httpService";

const name = 'Project';

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
    .then((res) => { return handleSuccess(res);}).catch((e) => { return processError(e);});
}

async function killswitch(id, input){
    return await httpService.delete('/'+ name + '/' + id + '/Killswitchproject/' + input)
    .then((res) => {return handleSuccess(res);}).catch((e)=> {return processError(e);});
}

export default { read, getByID, create, update, remove, searchProjectByName, listProjectActivities, killswitch};