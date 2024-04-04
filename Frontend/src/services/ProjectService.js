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
    .then((res) => {
        if (App.DEV) console.table(res.data);
        return res;
    }).catch((e) => {
        console.log(e);
        return { message: e };
    });
}




export default { read, getByID, create, update, remove, searchProjectByName, listProjectActivities};