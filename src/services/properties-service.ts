import {Property, SettingType} from "../api";

export const getBooleanProperty = (properties: Array<Property>, key: string) => {
    const property = getProperty(properties, key);

    if (property == undefined || property.settingType !== SettingType.BOOLEAN) {
        return false;
    }

    return property.value.toLowerCase() === 'true';
};

export const getStringProperty = (properties: Array<Property>, key: string) => {
    const property = getProperty(properties, key);

    if (property == undefined || property.settingType !== SettingType.STRING) {
        return '';
    }

    return property.value;
};

export const getNumericProperty = (properties: Array<Property>, key: string) => {
    const property = getProperty(properties, key);

    if (property == undefined || property.settingType !== SettingType.NUMBER) {
        return 0;
    }

    const num = parseFloat(property.value);
    return isNaN(num) ? 0 : num;
};

export const getSelectProperty = (properties: Array<Property>, key: string) => {
    const property = getProperty(properties, key);

    if (property == undefined || property.settingType !== SettingType.SELECT || !property.allowedValues) {
        return '';
    }

    // Возвращаем значение, если оно есть в allowedValues, иначе первое допустимое значение
    return property.allowedValues.includes(property.value)
        ? property.value
        : property.allowedValues[0] || '';
};

export const getImageProperty = (properties: Array<Property>, key: string) => {
    const property = getProperty(properties, key);

    if (property == undefined || property.settingType !== SettingType.IMAGE) {
        return '';
    }

    // Для IMAGE типа можно вернуть или значение, или fileName если он есть
    const fileName = property.fileName || property.value;
    return `http://localhost:8080/files/images/${fileName}`;
};

export const getColorProperty = (properties: Array<Property>, key: string) => {
    const property = getProperty(properties, key);

    if (property == undefined || property.settingType !== SettingType.COLOR) {
        return '';
    }

    // Простая валидация HEX цвета (можно расширить при необходимости)
    const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;
    return hexColorRegex.test(property.value) ? property.value : '#000000';
};

// Логика получения значений для каждого из типов. Добавление по мере необходимости
export const getImagePropertyValue = (property: Property) => {
    if (property.settingType !== SettingType.IMAGE) {
        return '';
    }

    // Для IMAGE типа можно вернуть или значение, или fileName если он есть
    const fileName = property.fileName || property.value;
    return `http://localhost:8080/files/images/${fileName}`;
};

const getProperty = (properties: Array<Property>, key: string) => {
    return properties.find(property => property.key === key);
}