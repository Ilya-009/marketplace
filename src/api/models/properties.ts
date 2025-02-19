import {createEffect, createEvent, createStore, sample} from 'effector';
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

export type Property = {
    id: number;
    key: string;
    value: string;
};

// MOCK API
// const getPropertiesMock: () => Array<Property> = () => {
//     return [
//         {
//             id: 1,
//             key: 'logo.image',
//             value: 'https://ir.ozone.ru/s3/cms/eb/t8d/wc200/logo-logo-ozon-blue-png.png'
//         },
//     ];
// };
// MOCK API

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
})
