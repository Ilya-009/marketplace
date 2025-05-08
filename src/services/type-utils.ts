export const formatDate = (date: Date, format: string = 'dd.MM.yyyy'): string => {
    if (date == null) {
        return '';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
    const year = date.getFullYear();

    return format
        .replace('dd', day)
        .replace('MM', month)
        .replace('yyyy', String(year));
};

export const formatDateTime = (
    date: Date,
    format: string = 'dd.MM.yyyy HH:mm:ss'
): string => {
    if (date == null) {
        return '';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
        .replace('dd', day)
        .replace('MM', month)
        .replace('yyyy', String(year))
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
};

export const limitString = (str: string, limitChars: number = 20): string => {
    if (str == null) {
        return '';
    }

    if (str.length < limitChars) {
        return str;
    }

    return str.substring(0, limitChars) + '...';
};