import {validateEmail, validatePassword} from "../../services";
import {emailValidationError, passwordValidationError, phoneValidationError} from "./constants.ts";
import React from "react";
import {isValidPhoneNumber} from "libphonenumber-js";
import {GoodCategory} from "../../api";

type UseStateSetterBooleanType = React.Dispatch<React.SetStateAction<boolean>>;
type UseStateSetterStringType = React.Dispatch<React.SetStateAction<string>>;

type SignInProps = {
    email: string;
    password: string;

    setEmailError: UseStateSetterBooleanType;
    setEmailErrorMessage: UseStateSetterStringType;

    setPasswordError: UseStateSetterBooleanType;
    setPasswordErrorMessage: UseStateSetterStringType;
};

type SignUpProps = SignInProps & {
    phone: string;
    setPhoneErrorMessage: UseStateSetterStringType;
    setPhoneError: UseStateSetterBooleanType;
};

type RegisterStoreProps = {
    country: string;
    setCountryErr: UseStateSetterBooleanType;

    organizationType: string;
    setOrganizationTypeErr: UseStateSetterBooleanType;

    storeName: string;
    setStoreNameErr: UseStateSetterBooleanType;

    mainGoodCategory?: GoodCategory;
    setMainGoodCategoryErr: UseStateSetterBooleanType;
};

export const validateSignInInputs =
    ({email, password, setEmailError, setEmailErrorMessage,
         setPasswordError, setPasswordErrorMessage}: SignInProps) => {
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);

    if (!emailValid) {
        setEmailError(true);
        setEmailErrorMessage(emailValidationError);
    } else {
        setEmailError(false);
        setEmailErrorMessage('');
    }

    if (!passwordValid) {
        setPasswordError(true);
        setPasswordErrorMessage(passwordValidationError);
    } else {
        setPasswordError(false);
        setPasswordErrorMessage('');
    }

    return emailValid && passwordValid;
};

export const validateSignUpInputs = ({email, password, phone, setEmailError, setEmailErrorMessage, setPhoneErrorMessage,
                                         setPasswordError, setPhoneError, setPasswordErrorMessage}: SignUpProps) => {
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    const phoneValid = isValidPhoneNumber(phone, 'RU');

    if (!emailValid) {
        setEmailError(true);
        setEmailErrorMessage(emailValidationError);
    } else {
        setEmailError(false);
        setEmailErrorMessage('');
    }

    if (!phoneValid) {
        setPhoneError(true);
        setPhoneErrorMessage(phoneValidationError);
    } else {
        setPhoneError(false);
        setPhoneErrorMessage('');
    }

    if (!passwordValid) {
        setPasswordError(true);
        setPasswordErrorMessage(passwordValidationError);
    } else {
        setPasswordError(false);
        setPasswordErrorMessage('');
    }

    return emailValid && passwordValid && phoneValid;
};

export const validateSellerRegister = ({
                                           country, setCountryErr,
                                           organizationType, setOrganizationTypeErr,
                                           storeName, setStoreNameErr,
                                           mainGoodCategory, setMainGoodCategoryErr}: RegisterStoreProps) => {
    const isCountryValid = !!country;
    const isOrganizationTypeValid = !!organizationType;
    const isStoreNameValid = !!storeName;
    const isMainGoodCategoryValid = !!mainGoodCategory;
    console.log(isCountryValid, isOrganizationTypeValid, isStoreNameValid, isMainGoodCategoryValid);

    setCountryErr(!isCountryValid);
    setOrganizationTypeErr(!isOrganizationTypeValid);
    setStoreNameErr(!isStoreNameValid);
    setMainGoodCategoryErr(!isMainGoodCategoryValid);

    return isCountryValid && isOrganizationTypeValid &&  isStoreNameValid && isMainGoodCategoryValid;
};