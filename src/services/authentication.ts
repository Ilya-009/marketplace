const isTokenValid = (token: string): boolean => {
    try {
        // Разделяем токен на части
        const parts = token.split('.');
        if (parts.length !== 3) {
            // Если токен не состоит из трех частей, он невалиден
            return false;
        }

        // Декодируем payload (вторая часть токена)
        const payload = JSON.parse(atob(parts[1]));

        // Проверяем наличие срока действия (exp)
        if (!payload.exp) {
            // Если срок действия отсутствует, токен невалиден
            return false;
        }

        // Получаем текущее время в секундах
        const currentTime = Math.floor(Date.now() / 1000);

        // Проверяем, не истек ли срок действия токена
        if (payload.exp > currentTime) {
            // Токен валиден
            return true;
        }

        // Срок действия истек
        return false;
    } catch (error) {
        // Если произошла ошибка (например, токен некорректен), возвращаем false
        console.log(error);
        return false;
    }
};

export const isUserAuthenticated = () : boolean => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token == null) {
        return false;
    }

    const isValid = isTokenValid(token);
    console.log(isValid);
    return isValid;
};