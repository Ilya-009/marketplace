import {Property} from "../api";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const getProperty = (properties: Array<Property>, key: string, defaultValue? : any) => {
    return properties
        .find(property => property.key === key)
        ?.value ?? (defaultValue ?? '');
}