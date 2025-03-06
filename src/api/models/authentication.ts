import {createEffect, createEvent, createStore, sample} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";
import {isUserAuthenticated} from "../../services";
import {loadCustomer} from "./customer.ts";

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

export enum UserRole {
    USER = 'ROLE_USER',
    ADMIN = 'ROLE_ADMIN',
    CUSTOMER = 'ROLE_CUSTOMER',
    SELLER = 'ROLE_SELLER',
}

export type UserInfo = {
    id: number;
    email: string;
    phone: string;
    roles: UserRole[];
};
export const defaultUserInfo: UserInfo = {
    id: -1,
    email: '',
    phone: '',
    roles: [UserRole.USER]
};

type LoadLoggedUserResult = UserInfo;
type ChangePasswordParam = {
    oldPassword: string;
    newPassword: string;
};

type ChangeUserPersonalDataRequest = {
    email: string;
    phone: string;
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

export const loadLoggedUser = createEvent();
export const $loggedUser = createStore<UserInfo>(defaultUserInfo);
export const $authError = createStore<string>('');
const loadLoggedUserFx = createEffect<void, LoadLoggedUserResult, AxiosError>({
    async handler() {
        return await apiClient.get(`${baseUrl}/auth/user`).then(({data}) => data);
    }
});

export const changePassword = createEvent<ChangePasswordParam>();
export const changePasswordFx = createEffect<ChangePasswordParam, void, AxiosError>({
    async handler(param) {
        await apiClient.patch(`${baseUrl}/auth/change-password`, param);
    }
});

export const changeUserPersonalData = createEvent<ChangeUserPersonalDataRequest>();
export const changeUserPersonalDataFx = createEffect<ChangeUserPersonalDataRequest, void, AxiosError>({
    async handler(param) {
        await apiClient.patch(`${baseUrl}/auth`, param);
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
    clock: loadLoggedUser,
    filter: () => isUserAuthenticated(),
    target: loadLoggedUserFx
});

sample({
    clock: loadLoggedUserFx.doneData,
    target: $loggedUser
});
sample({
    clock: loadLoggedUserFx.doneData,
    fn: (user) => {
        return {
            userId: user.id
        };
    },
    target: loadCustomer
});

sample({
    clock: changePassword,
    target: changePasswordFx
});

sample({
    clock: [clearAuthentication, changePasswordFx.done, changeUserPersonalDataFx.done],
    target: clearAuthenticationSession
});

sample({
    clock: changeUserPersonalData,
    target: changeUserPersonalDataFx
});

sample({
    clock: logOut,
    target: logOutFx
});

sample({
    clock: [registerUserFx.fail, loginUserFx.fail, changePasswordFx.fail],
    fn: (result) => result.error.message,
    target: $authError
})
