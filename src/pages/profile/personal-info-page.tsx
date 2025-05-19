import React, {useEffect, useState} from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Grid } from '@mui/material';
import {useUnit} from "effector-react";
import {$customer, $loggedUser, changePassword, changeUserPersonalData, updateCustomerPersonalInfoFx} from "../../api";

const EditProfile: React.FC = () => {
    const loggedUserInfo = useUnit($loggedUser);
    const customer = useUnit($customer);

    // Состояния для личных данных
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    // const [nameError, setNameError] = useState('');
    // const [surnameError, setSurnameError] = useState('');

    // Состояния для смены пароля
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    useEffect(() => {
        setEmail(loggedUserInfo.email);
        setPhone(loggedUserInfo.phone);
    }, [loggedUserInfo]);

    useEffect(() => {
        setName(customer.firstName);
        setSurname(customer.lastName);
    }, [customer]);

    // Валидация email
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('Email обязателен');
            return false;
        } else if (!regex.test(email)) {
            setEmailError('Некорректный email');
            return false;
        } else {
            setEmailError('');
            return true;
        }
    };

    // Валидация номера телефона
    const validatePhone = (phone: string) => {
        const regex = /^\+?[0-9]{10,15}$/;
        if (!phone) {
            setPhoneError('Номер телефона обязателен');
            return false;
        } else if (!regex.test(phone)) {
            setPhoneError('Некорректный номер телефона');
            return false;
        } else {
            setPhoneError('');
            return true;
        }
    };

    // Валидация старого пароля
    const validateOldPassword = (password: string) => {
        if (!password) {
            setOldPasswordError('Старый пароль обязателен');
            return false;
        } else {
            setOldPasswordError('');
            return true;
        }
    };

    // Валидация нового пароля
    const validateNewPassword = (password: string) => {
        if (!password) {
            setNewPasswordError('Новый пароль обязателен');
            return false;
        } else if (password.length < 8) {
            setNewPasswordError('Пароль должен содержать минимум 8 символов');
            return false;
        } else {
            setNewPasswordError('');
            return true;
        }
    };

    // Валидация подтверждения пароля
    const validateConfirmPassword = (password: string, newPassword: string) => {
        if (!password) {
            setConfirmPasswordError('Подтверждение пароля обязательно');
            return false;
        } else if (password !== newPassword) {
            setConfirmPasswordError('Пароли не совпадают');
            return false;
        } else {
            setConfirmPasswordError('');
            return true;
        }
    };

    // Обработчик отправки контактных данных
    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isEmailValid = validateEmail(email);
        const isPhoneValid = validatePhone(phone);

        if (isEmailValid && isPhoneValid) {
            changeUserPersonalData({email: email, phone: phone});
        }
    };

    // Обработчик отправки личных данных
    const handlePersonalInfoChangeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateCustomerPersonalInfoFx({id: customer.id, firstName: name, lastName: surname});
    };

    // Обработчик смены пароля
    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isOldPasswordValid = validateOldPassword(oldPassword);
        const isNewPasswordValid = validateNewPassword(newPassword);
        const isConfirmPasswordValid = validateConfirmPassword(confirmPassword, newPassword);

        if (isOldPasswordValid && isNewPasswordValid && isConfirmPasswordValid) {
            changePassword({oldPassword: oldPassword, newPassword: newPassword });
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Изменение личных данных
            </Typography>

            {/* Форма для личных данных */}
            <Card sx={{ marginBottom: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Контактные данные
                    </Typography>
                    <form onSubmit={handleProfileSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Электронная почта"
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => validateEmail(email)}
                                    error={!!emailError}
                                    helperText={emailError}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Номер телефона"
                                    fullWidth
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    onBlur={() => validatePhone(phone)}
                                    error={!!phoneError}
                                    helperText={phoneError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary">
                                    Сохранить изменения
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            {/* Форма для личных данных */}
            <Card sx={{ marginBottom: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Личные данные
                    </Typography>
                    <form onSubmit={handlePersonalInfoChangeSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Имя"
                                    fullWidth
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Фамилия"
                                    fullWidth
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary">
                                    Сохранить изменения
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            {/* Форма для смены пароля */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Смена пароля
                    </Typography>
                    <form onSubmit={handlePasswordSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Старый пароль"
                                    type="password"
                                    fullWidth
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    onBlur={() => validateOldPassword(oldPassword)}
                                    error={!!oldPasswordError}
                                    helperText={oldPasswordError}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Новый пароль"
                                    type="password"
                                    fullWidth
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    onBlur={() => validateNewPassword(newPassword)}
                                    error={!!newPasswordError}
                                    helperText={newPasswordError}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Подтверждение пароля"
                                    type="password"
                                    fullWidth
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onBlur={() => validateConfirmPassword(confirmPassword, newPassword)}
                                    error={!!confirmPasswordError}
                                    helperText={confirmPasswordError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary">
                                    Сменить пароль
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EditProfile;