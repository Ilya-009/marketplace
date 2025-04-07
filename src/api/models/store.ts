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
type LoadStoreByStoreIdParam = {
    storeId: number;
};
type RegisterStoreParam = {
    name: string;
    country: string;
    organizationType: OrganizationType;
    userId: number;
    mainCategoryId: number;
};
type UpdateStoreParam = {
    id: number;
    logoImage: File;
    name: string;
    description: string;
};

export const loadStoreByUser = createEvent<LoadStoreByUserParam>();
export const loadStoreById = createEvent<LoadStoreByStoreIdParam>();

export const $store = createStore<Store>(defaultStore);

const loadStoreByUserFx = createEffect<LoadStoreByUserParam, Store, AxiosError>({
    async handler({userId}) {
        return await apiClient.get(`${baseUrl}/stores/byUser/${userId}`).then(({ data }) => data);
    }
});
const loadStoreByStoreIdFx = createEffect<LoadStoreByStoreIdParam, Store, AxiosError>({
    async handler({storeId}) {
        return await apiClient.get(`${baseUrl}/stores/${storeId}`).then(({ data }) => data);
    }
});
export const registerStoreFx = createEffect<RegisterStoreParam, Store, AxiosError>({
    async handler(param) {
        return await apiClient.post(`${baseUrl}/stores`, param).then(({ data }) => data);
    }
});
export const updateStoreFx = createEffect<UpdateStoreParam, void, AxiosError>({
    async handler({id, logoImage, name, description}) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);

        if (logoImage) {
            formData.append('logoImage', logoImage);
        }

        await apiClient.put(`${baseUrl}/stores/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
});

sample({
    clock: loadStoreByUser,
    filter: ({userId}) => userId > 0,
    target: loadStoreByUserFx
});
sample({
    clock: loadStoreById,
    filter: ({storeId}) => storeId > 0,
    target: loadStoreByStoreIdFx
});
sample({
    clock: [loadStoreByUserFx.doneData, registerStoreFx.doneData],
    target: $store
});