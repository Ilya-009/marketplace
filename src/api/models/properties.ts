import {createEffect, createEvent, createStore, sample} from 'effector';
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

export interface Property {
    id: number;
    key: string;
    displayName: string;
    settingType: SettingType;
    propertyGroup: PropertyGroup;
    allowedValues?: string[];
    fileName?: string;
    description: string;
    value: string;
    removable: boolean;
}

export enum SettingType {
    BOOLEAN = 'BOOLEAN',
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    SELECT = 'SELECT',
    IMAGE = 'IMAGE',
    COLOR = 'COLOR'
}

export enum PropertyGroup {
    MAIN = 'MAIN',
    UI = 'UI',
    LOGIC = 'LOGIC'
}

export enum MarketplaceType {
    GOODS,
    SERVICES
}

type LoadPropertiesParam = void;
type LoadPropertiesByKeysParam = {keys: string[]};
type LoadPropertiesResult = Property[];

type CreatePropertyParam = {
    key: string;
    displayName: string;
    settingType: SettingType;
    propertyGroup: PropertyGroup;
    allowedValues?: string[];
    description: string;
    value: string;
};
type DeletePropertyParam = {
    id: number;
};
type UpdatePropertyValueParam = {
    id: number;
    value: string;
};

export const loadProperties = createEvent<LoadPropertiesParam>();
export const deleteProperty = createEvent<DeletePropertyParam>();
export const $properties = createStore<Property[]>([]);

export const loadPropertiesFx = createEffect<LoadPropertiesParam, LoadPropertiesResult, AxiosError>({
    async handler() {
        return await apiClient.get(`${baseUrl}/properties`).then(({ data }) => data);
    }
});

export const loadPropertiesByKeysFx = createEffect<LoadPropertiesByKeysParam, LoadPropertiesResult, AxiosError>({
    async handler({keys}) {
        const keysStr = keys.join(',');
        return await apiClient.get(`${baseUrl}/properties/by-keys?keys=${keysStr}`).then(({ data }) => data);
    }
});

export const createPropertyFx = createEffect<CreatePropertyParam, Property, AxiosError>({
    async handler(request) {
        return await apiClient.post(`${baseUrl}/properties`, request).then(({ data }) => data);
    }
});

const deletePropertyFx = createEffect<DeletePropertyParam, void, AxiosError>({
    async handler({id}) {
        await apiClient.delete(`${baseUrl}/properties/${id}`);
    }
});

export const updatePropertyFx = createEffect<UpdatePropertyValueParam, Property, AxiosError>({
    async handler({id, value}) {
        return await apiClient.patch(`${baseUrl}/properties/${id}`, {value: value}).then(({ data }) => data);
    }
});

sample({
    clock: loadProperties,
    target: loadPropertiesFx
});

sample({
    clock: deleteProperty,
    target: deletePropertyFx
});

sample({
    clock: [loadPropertiesFx.doneData, loadPropertiesByKeysFx.doneData],
    fn: current => [...new Set([...current, ...$properties.getState()])],
    target: $properties
});
