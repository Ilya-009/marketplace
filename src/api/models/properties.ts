import {createEffect, createEvent, createStore, sample} from 'effector';
import {AxiosError} from "axios";

export type Property = {
    key: string;
    value: string;
};

// MOCK API
const getPropertiesMock: () => Array<Property> = () => {
    return [
        {
            key: 'logo.image',
            value: 'https://ir.ozone.ru/s3/cms/eb/t8d/wc200/logo-logo-ozon-blue-png.png'
        },
    ];
};
// MOCK API

type LoadPropertiesParam = void;
type LoadPropertiesResult = Property[];

export const loadProperties = createEvent<LoadPropertiesParam>();
export const $properties = createStore<LoadPropertiesResult>([]);

const loadPropertiesFx = createEffect<LoadPropertiesParam, LoadPropertiesResult, AxiosError>({
    async handler() {
        return getPropertiesMock();
        // return await apiClient.get(`/api/properties/getAll`).then(({ data }) => data.data);
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
