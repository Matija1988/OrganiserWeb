import { App } from "../constants";
import { httpService } from "./httpService";

async function getProjects() {

    return await httpService.get('/Project')
    .then((res) =>{
        if(App.DEV) console.table(res.data);

        return res;
    }).catch((e)=>{console.log(e);
    });

}

async function addProject(project) {

    const reply = await httpService.post('/Project', project)
    .then(()=> {
        return {ok: true, message: 'Project added'}
    })
    .catch((e) => {
        return {ok: false, message: e.res.data}
    });
    return reply;
}

async function changeProject(id, project) {

    const reply = await httpService.put('/Project' + id, project)
    .then(()=>{
        return{ok:true, message: 'Project changed'}
    })
    .catch((e)=>{
        return{ok: false, message: 'Task failed successfully'}
    });
    return reply;

}

async function deleteProject(id) {

    return await httpService.delete('/Project/' + id)
    .then((res)=>{
        return{ok: true, message: res};
    }).catch((e)=>{
        console.log(e);
    });
}

async function getById(id) {

    return await httpService.get('/Project/' + id)
    .then((res) => {
       if(App.DEV) console.table(res.data);

       return res;

    }).catch((e)=>{
        console.log(e);
        return{message : e};
    });
}

export default { getProjects, addProject, changeProject, deleteProject, getById}