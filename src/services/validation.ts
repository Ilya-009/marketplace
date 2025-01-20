export const validateEmail: (email: string) => boolean = (email: string) => {
    return !!email && /\S+@\S+\.\S+/.test(email);
};

export const validatePassword : (password: string) => boolean = (password: string) => {
    return !!password && password.length >= 6;
};