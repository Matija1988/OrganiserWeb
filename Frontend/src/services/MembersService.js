import { App } from "../constants";
import { httpService } from "./httpService";

const name = 'Member';

async function getMembers() {
    return await httpService.get('/' + name)
    .then((res)=>{
        if(App.DEV) console.table(res.date);

        return res;
    }).catch((e)=>{
        console.log(e);
    });
}

async function deleteMember(id) {
    const reply = await httpService.delete('/' + name + '/' + id)
    .then(()=>{
        return {ok: true, message: 'Member deleted'};
    }).catch((e) =>{
        console.log(e);
        return{ok:true, message: e.response.data};
    });
    return reply;
}

async function createMember(entity) {

    const reply = await httpService.post('/' + name, entity)
    .then(()=>{
        console.log('Member entry created');
        return {ok:true, messages: 'Member added'};
    }).catch((error)=>{
        console.log(error);
        return{ok: false, message: error.response.data};
    });
    return reply;
}

async function getById(id) {
    return await httpService.get('/' + name + '/' + id)
    .then((res)=> res)
    .catch((e)=>{
        console.log(e);
        return { ok: false, message: e.response.data};
    });
}

async function updateMember(id, entity) {
    const reply = await httpService.put('/' + name + '/' + id, entity)
    .then(()=>{
        return { ok: true, message: 'Member updated'};
    }). catch((error)=> {
        return {ok: false, message: error.response.data};
    });

    return reply;
}

export default {
    getMembers,
    deleteMember,
    createMember,
    getById,
    updateMember
}
