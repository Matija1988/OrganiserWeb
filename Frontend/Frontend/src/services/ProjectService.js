import {App } from "../constants";
import {httpService} from "./httpService";

async function getProjectS() {
    return await httpService.get('/Project')
    .then((res)=>{
        if(App.DEV) console.table(res.data);
        return res;
    }).catch((e) =>{
        console.log(e);
    });
}

export default {
    getProjects
};