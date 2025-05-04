import React, {useEffect, useMemo, useState} from "react";
import {SidebarPageBox} from "../../components";
import {useUnit} from "effector-react";
import {
    $isUserLoading,
    $loggedUser,
    createMewUserFx,
    loadAllUsersFx,
    updateUserFx,
    UserInfo,
    UserRole
} from "../../api";
import {useNavigate} from "react-router-dom";
import {isUserAuthenticatedWithRole} from "../../services";
import {
    Alert,
    Box,
    Button, CircularProgress, IconButton,
    Paper, Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {Edit as EditIcon} from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {userRoles} from "../../constants.ts";

const UsersManagementPage: React.FC = () => {
    const [loggedUser, isUserLoading] = useUnit([$loggedUser, $isUserLoading]);
    const navigate = useNavigate();

    const hasAccess = useMemo(() => {
        if (isUserLoading) return true;
        return isUserAuthenticatedWithRole(loggedUser, UserRole.ROLE_MASTER_ADMIN);
    }, [isUserLoading, loggedUser]);

    useEffect(() => {
        if (!isUserLoading && !hasAccess) {
            navigate('/404');
        }
    }, [hasAccess, isUserLoading, navigate]);

    const [users, setUsers] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [openEdit, setOpenEdit] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [currentUser, setCurrentUser] = useState<Partial<UserInfo>>({
        email: '',
        phone: '',
        roles: []
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    // Загрузка пользователей
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await loadAllUsersFx();
                setUsers(response);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleEditClick = (user: UserInfo) => {
        setCurrentUser({ ...user });
        setOpenEdit(true);
    };

    const handleCreateClick = () => {
        setCurrentUser({ email: '', phone: '', roles: [] });
        setOpenCreate(true);
    };

    const handleClose = () => {
        setOpenEdit(false);
        setOpenCreate(false);
    };

    const saveUser = async () => {
        if (currentUser.id) {
            // Обновление существующего пользователя
            const updatedUser = await updateUserFx(currentUser as UserInfo);
            setUsers(users.map(user =>
                user.id === currentUser.id ? updatedUser : user
            ));
            showSnackbar('Пользователь успешно обновлен', 'success');
        } else {
            // Создание нового пользователя
            const createdUser = await createMewUserFx(currentUser as UserInfo);
            setUsers([...users, createdUser]);
            showSnackbar('Пользователь успешно создан', 'success');
        }
        handleClose();
    };

    const handleRoleChange = (role: UserRole, checked: boolean) => {
        setCurrentUser(prev => {
            const roles = prev.roles || [];
            return {
                ...prev,
                roles: checked
                    ? [...roles, role]
                    : roles.filter(r => r !== role)
            };
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentUser(prev => ({ ...prev, [name]: value }));
    };

    if (loading && users.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <SidebarPageBox sx={{ width: '90%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Управление пользователями</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateClick}
                >
                    Добавить пользователя
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Телефон</TableCell>
                            <TableCell>Роли</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>
                                    {user.roles.map(r => userRoles.get(r)).join(', ')}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditClick(user)}>
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Модальное окно подтверждения удаления */}
            {/*<ConfirmModal*/}
            {/*    isOpen={openConfirm}*/}
            {/*    title='Подтвердите удаление?'*/}
            {/*    content='Вы точно хотите удалить выбранное? Отменить данное действие будет невозможно.'*/}
            {/*    cancelBtnText='Отмена'*/}
            {/*    submitBtnText='Удалить'*/}
            {/*    onCancel={handleClose}*/}
            {/*    onSubmit={confirmDelete}*/}
            {/*/>*/}

            {/* Модальное окно редактирования/создания */}
            <Dialog open={openEdit || openCreate} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    {openCreate ? 'Создание пользователя' : 'Редактирование пользователя'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Email"
                            name="email"
                            value={currentUser.email || ''}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Телефон"
                            name="phone"
                            value={currentUser.phone || ''}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <Typography variant="subtitle1">Роли</Typography>
                        {[UserRole.ADMIN, UserRole.SELLER, UserRole.CUSTOMER].map(role => (
                            <FormControlLabel
                                key={role}
                                control={
                                    <Checkbox
                                        checked={currentUser.roles?.includes(role) || false}
                                        onChange={(e) => handleRoleChange(role, e.target.checked)}
                                    />
                                }
                                label={role.replace('ROLE_', '')}
                            />
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Button onClick={saveUser} variant="contained">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SidebarPageBox>
    )
};

export default UsersManagementPage;