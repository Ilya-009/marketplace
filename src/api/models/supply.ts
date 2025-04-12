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
    createdAt: Date;
    supplyGoods: SupplyGood[];
};

export const $supplies = createStore<Supply[]>([]);
export const createSupply = createEvent<CreateSupplyParam>();

const createSupplyFx = createEffect<CreateSupplyParam, void, AxiosError>({
    async handler(param) {
        await apiClient.post(`${baseUrl}/stores/supplies`, param);
    }
});

sample({
    clock: createSupply,
    target: createSupplyFx
});

export const loadSupplies = async (): Promise<Supply[]> => {
    // Здесь логика запроса данных с сервера
    // Возвращаем пример поставок для имитации
    return [
        {
            id: 1,
            status: SupplyStatus.PENDING,
            supplyGoods: [
                { goodId: 101, quantity: 50 },
                { goodId: 102, quantity: 30 },
            ],
            createdAt: '2025-04-10',
        },
        {
            id: 2,
            status: SupplyStatus.COMPLETED,
            supplyGoods: [
                { goodId: 103, quantity: 20 },
                { goodId: 104, quantity: 10 },
            ],
            createdAt: '2025-04-05',
        },
    ];
};
