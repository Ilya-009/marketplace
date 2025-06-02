import {createEffect, createEvent, createStore, sample} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

export interface Address {
    id: number;
    country: string;
    city: string;
    street: string
    houseNumber: string
    entranceNumber: string
    flatNumber: string
    postNumber: string
}
export const emptyAddress: Address = {
    id: -1,
    country: '',
    city: '',
    street: '',
    houseNumber: '',
    entranceNumber: '',
    flatNumber: '',
    postNumber: ''
};

type LoadAddressParam = {
   addressIds: number[];
};

type CreateAddressParam = {
    customerId: number;
    country: string;
    city: string;
    street: string;
    houseNumber: string;
    entranceNumber: string;
    flatNumber: string;
    postNumber: string;
};

export const loadAddresses = createEvent<LoadAddressParam>();
export const $addresses = createStore<Address[]>([]);

const loadAddressesFx = createEffect<LoadAddressParam, Address[], AxiosError>({
    async handler({addressIds}) {
        const ids = addressIds.join(',');
        return await apiClient.get(`${baseUrl}/addresses/by-ids?ids=${ids}`)
            .then(({ data }) => data);
    }
});

// const createAddressFx = createEffect<CreateAddressParam, void, AxiosError>({
//     async handler(param) {
//         const ids = addressIds.join(',');
//         return await apiClient.post(`${baseUrl}/addresses/by-ids?ids=${ids}`)
//             .then(({ data }) => data);
//     }
// });

sample({
    clock: loadAddresses,
    target: loadAddressesFx
});
sample({
    clock: loadAddressesFx.doneData,
    target: $addresses
});