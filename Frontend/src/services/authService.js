import { httpService, handleSuccess, processError } from "./httpService";

export async function logInService(userData) {
    return await httpService
        .post('/Authorization/token', userData)
        .then((res) => { return handleSuccess(res); })
        .catch((e) => { return { error: true, data: [{ property: 'Authorization', message: e.response.data }] } });
}