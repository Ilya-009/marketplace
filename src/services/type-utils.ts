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

// Формат 14.05.2025 18:39
export function isDateValid(dateStr: string, validDays: number): boolean {
    // Ожидается формат: "14.05.2025 18:39"
    const dateTimeRegex = /^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})$/;
    const match = dateStr.match(dateTimeRegex);

    if (!match) {
        throw new Error("Неверный формат даты. Ожидается 'DD.MM.YYYY HH:mm'");
    }

    const [_, day, month, year, hours, minutes] = match.map(Number);

    // В JS месяцы начинаются с 0 (январь — 0, декабрь — 11)
    const parsedDate = new Date(year, month - 1, day, hours, minutes);

    if (isNaN(parsedDate.getTime())) {
        throw new Error("Не удалось распарсить дату");
    }

    const now = new Date();
    const expirationDate = new Date(parsedDate);
    expirationDate.setDate(expirationDate.getDate() + validDays);

    return now <= expirationDate;
}


export const limitString = (str: string, limitChars: number = 20): string => {
    if (str == null) {
        return '';
    }

    if (str.length < limitChars) {
        return str;
    }

    return str.substring(0, limitChars) + '...';
};