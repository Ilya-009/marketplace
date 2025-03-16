import {createEffect, createEvent, createStore, sample} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

export enum OrganizationType {
    IP = "IP",
    SELF_EMPLOYED = "SELF_EMPLOYED",
    AO = "AO",
    OOO = "OOO",
    PAO = "PAO",
    ZAO = "ZAO",
    OAO = 'OAO'
}

export type Store = {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    logoImage: string;
    country: string;
    organizationType: OrganizationType;
    userId: number;
};
const defaultStore: Store = {
    id: -1,
    name: '',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    logoImage: '',
    country: 'Россия',
    organizationType: OrganizationType.IP,
    userId: -1
};

type LoadStoreByUserParam = {
    userId: number;
};
type RegisterStoreParam = {
    name: string;
    country: string;
    organizationType: OrganizationType;
    userId: number;
    mainCategoryId: number;
};

export const loadStoreByUser = createEvent<LoadStoreByUserParam>();

export const $store = createStore<Store>(defaultStore);

const loadStoreByUserFx = createEffect<LoadStoreByUserParam, Store, AxiosError>({
    async handler({userId}) {
        return await apiClient.get(`${baseUrl}/stores/byUser/${userId}`).then(({ data }) => data);
    }
});
export const registerStoreFx = createEffect<RegisterStoreParam, Store, AxiosError>({
    async handler(param) {
        return await apiClient.post(`${baseUrl}/stores`, param).then(({ data }) => data);
    }
});

sample({
    clock: loadStoreByUser,
    filter: ({userId}) => userId > 0,
    target: loadStoreByUserFx
});
sample({
    clock: [loadStoreByUserFx.doneData, registerStoreFx.doneData],
    target: $store
});