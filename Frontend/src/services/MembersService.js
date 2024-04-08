import { handleSuccess, httpService, processError,read, getByID, create, update, remove } from "./httpService";

const name = 'Member';


async function searchMemberByName(input) {
    return await httpService.get('/' + name +'/Members/SearchByName/'+ input)
    .then((res)=>{return handleSuccess(res);}).catch((e)=>{return processError(e);});
}

export default {
    read,
    remove,
    create,
    getByID,
    update,
    searchMemberByName
}
