import {validateEmail, validatePassword} from "../../services";
import {emailValidationError, passwordValidationError} from "./constants.ts";
import React from "react";

type UseStateSetterBooleanType = React.Dispatch<React.SetStateAction<boolean>>;
type UseStateSetterStringType = React.Dispatch<React.SetStateAction<string>>;

type Props = {
    email: string;
    password: string;

    setEmailError: UseStateSetterBooleanType;
    setEmailErrorMessage: UseStateSetterStringType;

    setPasswordError: UseStateSetterBooleanType;
    setPasswordErrorMessage: UseStateSetterStringType;
};

export const validateInputs =
    ({email, password, setEmailError, setEmailErrorMessage, setPasswordError, setPasswordErrorMessage}: Props) => {
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