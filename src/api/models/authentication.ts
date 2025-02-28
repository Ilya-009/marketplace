import {createEffect, createEvent, createStore, sample} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";
import {isUserAuthenticated} from "../../services";

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

export type UserInfo = {
    id: number;
    email: string;
    phone: string;
};
const defaultUserInfo: UserInfo = {
    id: 0,
    email: '',
    phone: ''
};

type LoadLoggedUserParam = void;
type LoadLoggedUserResult = UserInfo;

type ChangePasswordParam = {
    oldPassword: string;
    newPassword: string;
};

const clearAuthenticationSession = createEffect({
    async handler() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }
});

export const clearAuthentication = createEvent();

export const registerUser = createEvent<RegisterUserParam>();
const registerUserFx = createEffect<RegisterUserParam, AuthenticateUserResult, AxiosError>({
    async handler(param) {
        const result = await apiClient.post(`${baseUrl}/auth/sign-up`, param).then((response) => response.data);
        const token = result.token;

        if (token) {
            localStorage.setItem('token', token);
        }

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

export const getLoggedUser = createEvent<LoadLoggedUserParam>();
export const $loggedUser = createStore<UserInfo>(defaultUserInfo);
export const getLoggedUserFx = createEffect<LoadLoggedUserParam, LoadLoggedUserResult, AxiosError>({
    async handler() {
        return await apiClient.get(`${baseUrl}/auth/user`).then(({data}) => data);
    }
});

export const changePassword = createEvent<ChangePasswordParam>();
export const changePasswordFx = createEffect<ChangePasswordParam, void, AxiosError>({
    async handler(param) {
        await apiClient.patch(`${baseUrl}/auth/user`, param);
    }
});

export const logOut = createEvent<void>();
export const logOutFx = createEffect<void, void, AxiosError>({
    async handler() {
        await apiClient.post(`${baseUrl}/auth/sign-out`);
        await clearAuthenticationSession();
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

sample({
    clock: getLoggedUser,
    filter: () => isUserAuthenticated(),
    target: getLoggedUserFx
});

sample({
    clock: getLoggedUserFx.doneData,
    target: $loggedUser
});

sample({
    clock: changePassword,
    target: changePasswordFx
});

sample({
    clock: clearAuthentication,
    target: clearAuthenticationSession
});

sample({
    clock: changePasswordFx.done,
    target: clearAuthenticationSession
});

sample({
    clock: logOut,
    target: logOutFx
});
