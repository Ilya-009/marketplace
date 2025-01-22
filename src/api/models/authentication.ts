import {createEffect, createEvent, sample} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

type RegisterUserParam = {
    email: string;
    phone: string;
    password: string;
};
type AuthenticateUserResult = {
    token: string;
};

type LoginUserParam = {
    email: string;
    password: string;
};

export const registerUser = createEvent<RegisterUserParam>();
const registerUserFx = createEffect<RegisterUserParam, AuthenticateUserResult, AxiosError>({
    async handler(param) {
        const result = await apiClient.post(`${baseUrl}/auth/sign-up`, param).then((response) => response.data);
        const token = result.token;
        localStorage.setItem('token', token);

        return result;
    }
});

export const loginUser = createEvent<LoginUserParam>();
export const loginUserFx = createEffect<LoginUserParam, AuthenticateUserResult, AxiosError>({
    async handler(param) {
        const result = await apiClient.post(`${baseUrl}/auth/sign-in`, param).then((response) => response.data);
        const token = result.token;
        localStorage.setItem('token', token);

        return result;
    }
});

sample({
    clock: registerUser,
    target: registerUserFx
});

sample({
    clock: loginUser,
    target: loginUserFx
});
