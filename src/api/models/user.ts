import {createEffect} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";
import {UserInfo, UserStatus} from "./authentication.ts";

type ChangeUserStatusParam = {
    id: number;
    status: UserStatus;
    comment?: string;
    endDateTime?: Date;
};

export const loadAllUsersFx = createEffect<void, UserInfo[], AxiosError>({
    async handler() {
        return await apiClient.get(`${baseUrl}/auth/user/control`).then(({data}) => data);
    }
});

export const updateUserFx = createEffect<UserInfo, UserInfo, AxiosError>({
    async handler(userInfo) {
        return await apiClient.put(`${baseUrl}/auth/user/control`, userInfo).then(({data}) => data);
    }
});

export const changeUserStatusFx = createEffect<ChangeUserStatusParam, UserInfo, AxiosError>({
    async handler(userInfo) {
        return await apiClient.patch(`${baseUrl}/auth/user/control/${userInfo.id}`, userInfo).then(({data}) => data);
    }
});
