import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import {useState} from "react";
import {validateSignUpInputs} from "../components";
import {registerUser} from "../api/models/authentication.ts";
import {useNavigate} from "react-router-dom";
import {primaryTextColor} from "../ui";

const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignUpContainer = styled(Stack)(({theme}) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');

    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState(false);
    const [phoneErrorMessage, setPhoneErrorMessage] = useState('');

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLButtonElement>) => {
        const validationResult = validateSignUpInputs({
            email, password, phone,
            setEmailError, setPhoneError, setEmailErrorMessage,
            setPasswordError, setPasswordErrorMessage, setPhoneErrorMessage
        });

        if (!validationResult) {
            event.preventDefault();
            return false;
        }

        registerUser({
            email: email,
            phone: phone,
            password: password
        });

        navigate('/');
    };

    return (
        <>
            <CssBaseline enableColorScheme/>
            <SignUpContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                    >
                        Регистрация
                    </Typography>
                    <Box
                        component="form"
                        sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                    >
                        <FormControl>
                            <FormLabel htmlFor="email">Эл. почта</FormLabel>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                placeholder="email@mail.ru"
                                name="email"
                                autoComplete="email"
                                variant="outlined"
                                error={emailError}
                                helperText={emailErrorMessage}
                                color={passwordError ? 'error' : 'primary'}
                                sx={{ input: { color: primaryTextColor } }}
                                onInput={e => setEmail((e.target as HTMLInputElement).value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="email">Номер телефона</FormLabel>
                            <TextField
                                required
                                fullWidth
                                placeholder="+7 999 999 99 99"
                                name="email"
                                value={phone}
                                type="tel"
                                variant="outlined"
                                error={phoneError}
                                helperText={phoneErrorMessage}
                                color={passwordError ? 'error' : 'primary'}
                                sx={{ input: { color: primaryTextColor } }}
                                onInput={e => setPhone((e.target as HTMLInputElement).value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Пароль</FormLabel>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                variant="outlined"
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                sx={{ input: { color: primaryTextColor } }}
                                color={passwordError ? 'error' : 'primary'}
                                onInput={e => setPassword((e.target as HTMLInputElement).value)}
                            />
                        </FormControl>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleSubmit}
                        >
                            Регистрация
                        </Button>
                    </Box>
                    <Divider>
                        <Typography sx={{color: 'text.secondary'}}>или</Typography>
                    </Divider>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <Typography sx={{textAlign: 'center', color: primaryTextColor}}>
                            Уже имеете аккаунт?{' '}
                            <Link
                                href="/signIn"
                                variant="body2"
                                sx={{alignSelf: 'center'}}
                            >
                                Войти
                            </Link>
                        </Typography>

                        <Button href='/' fullWidth variant="outlined">
                            Вернуться на главную
                        </Button>
                    </Box>
                </Card>
            </SignUpContainer>
        </>
    );
}