import {createEffect, createEvent, createStore, sample} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

export interface Supply {
    id: number;
    status: SupplyStatus;
    supplyGoods: Array<SupplyGood>;
    createdAt: string;
}

export interface SupplyGood {
    goodId: number;
    quantity: number;
}

export enum SupplyStatus {
    PENDING = 'PENDING', // Ожидает
    COMPLETED = 'COMPLETED', // Завершена
    CANCELLED = 'CANCELLED', // Отменена
}

type CreateSupplyParam = {
    storeId: number;
    createdAt: Date;
    supplyGoods: SupplyGood[];
};
type LoadAllSuppliesParam = {
    storeId: number;
};
type UpdateSupplyParam = {
    updatedSupply: Supply;
};

export const $supplies = createStore<Supply[]>([]);
export const loadSuppliesByStore = createEvent<LoadAllSuppliesParam>();

const loadSuppliesFx = createEffect<LoadAllSuppliesParam, Supply[], AxiosError>({
    async handler({storeId}) {
        return await apiClient.get(`${baseUrl}/stores/supplies?storeId=${storeId}`).then(({ data }) => data);
    }
});

export const updateSupplyFx = createEffect<UpdateSupplyParam, void, AxiosError>({
    async handler(param) {
        await apiClient.put(`${baseUrl}/stores/supplies/${param.updatedSupply.id}`, param.updatedSupply);
    }
});

export const createSupplyFx = createEffect<CreateSupplyParam, void, AxiosError>({
    async handler(param) {
        await apiClient.post(`${baseUrl}/stores/supplies`, param);
    }
});

sample({
    clock: loadSuppliesByStore,
    target: loadSuppliesFx
});

sample({
    clock: loadSuppliesFx.doneData,
    target: $supplies
});