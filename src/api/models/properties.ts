import {createEffect, createEvent, createStore, sample} from 'effector';
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

export type Property = {
    id: number;
    key: string;
    value: string;
};

type LoadPropertiesParam = void;
type LoadPropertiesResult = Property[];

export const loadProperties = createEvent<LoadPropertiesParam>();
export const $properties = createStore<LoadPropertiesResult>([]);

const loadPropertiesFx = createEffect<LoadPropertiesParam, LoadPropertiesResult, AxiosError>({
    async handler() {
        return await apiClient.get(`${baseUrl}/properties`).then(({ data }) => data);
    }
});

sample({
    clock: loadProperties,
    target: loadPropertiesFx
});

sample({
    clock: loadPropertiesFx.doneData,
    target: $properties
});
