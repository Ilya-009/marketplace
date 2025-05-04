import React, {useEffect, useMemo, useState} from "react";
import {SidebarPageBox} from "../../components";
import {useUnit} from "effector-react";
import {
    $isUserLoading,
    $loggedUser, changeUserStatusFx,
    loadAllUsersFx,
    updateUserFx,
    UserInfo,
    UserRole, UserStatus
} from "../../api";
import {useNavigate} from "react-router-dom";
import {isUserAuthenticatedWithRole} from "../../services";
import {
    Alert,
    Box,
    Button, Chip, CircularProgress, IconButton, MenuItem,
    Paper, Select, Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@mui/material";
import {Edit as EditIcon, Settings} from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {userRoles, userStatuses} from "../../constants.ts";

const UsersManagementPage: React.FC = () => {
    const [loggedUser, isUserLoading] = useUnit([$loggedUser, $isUserLoading]);
    const navigate = useNavigate();

    const hasAccess = useMemo(() => {
        if (isUserLoading) return true;
        return isUserAuthenticatedWithRole(loggedUser, UserRole.ROLE_MASTER_ADMIN);
    }, [isUserLoading, loggedUser]);

    // useEffect(() => {
    //     if (!isUserLoading && !hasAccess) {
    //         navigate('/404');
    //     }
    // }, [hasAccess, isUserLoading, navigate]);

    const [users, setUsers] = useState<(UserInfo & { status: UserStatus })[]>([]);
    const [loading, setLoading] = useState(true);
    const [openEdit, setOpenEdit] = useState(false);
    const [openStatus, setOpenStatus] = useState(false);
    const [currentUser, setCurrentUser] = useState<Partial<UserInfo & { status: UserStatus, statusComment: string }>>({
        email: '',
        phone: '',
        roles: [],
        status: UserStatus.ACTIVE,
        statusComment: ''
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
                setUsers(response.map(user => ({
                    ...user,
                    status: user.status || UserStatus.ACTIVE // Дефолтный статус
                })));
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

    const handleStatusClick = (user: UserInfo) => {
        setCurrentUser({ ...user });
        setOpenStatus(true);
    };

    const handleClose = () => {
        setOpenEdit(false);
        setOpenStatus(false);
    };

    const saveUser = async () => {
        try {
            if (currentUser.id) {
                // Обновление существующего пользователя
                const updatedUser = await updateUserFx(currentUser as UserInfo);
                setUsers(users.map(user =>
                    user.id === currentUser.id ? { ...updatedUser, status: currentUser.status || UserStatus.ACTIVE } : user
                ));
                showSnackbar('Пользователь успешно обновлен', 'success');
            }
            handleClose();
        } catch (error) {
            showSnackbar('Ошибка при обновлении пользователя', 'error');
        }
    };

    const updateStatus = async (newStatus: UserStatus) => {
        try {
            if (currentUser.id) {
                await changeUserStatusFx({
                    id: currentUser.id,
                    status: newStatus,
                    comment: currentUser.statusComment
                });
                setUsers(users.map(user =>
                    user.id === currentUser.id ? { ...user, status: newStatus } : user
                ));
                showSnackbar('Статус пользователя обновлен', 'success');
                handleClose();
            }
        } catch (error) {
            showSnackbar('Ошибка при изменении статуса', 'error');
        }
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

    const getStatusColor = (status: UserStatus) => {
        switch (status) {
            case UserStatus.ACTIVE: return 'success';
            case UserStatus.BANNED: return 'error';
            case UserStatus.ON_CHECK: return 'warning';
            default: return 'info';
        }
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
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Телефон</TableCell>
                            <TableCell>Роли</TableCell>
                            <TableCell>Статус</TableCell>
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
                                    <Chip
                                        label={user.status}
                                        color={getStatusColor(user.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditClick(user)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleStatusClick(user)}>
                                        <Settings />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Модальное окно редактирования */}
            <Dialog open={openEdit} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Редактирование пользователя</DialogTitle>
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
                                label={userRoles.get(role)}
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

            {/* Модальное окно изменения статуса */}
            <Dialog open={openStatus} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle>Изменение статуса пользователя</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <Typography>Текущий статус:
                            <Chip
                                label={currentUser.status}
                                color={getStatusColor(currentUser.status as UserStatus)}
                                sx={{ ml: 1 }}
                            />
                        </Typography>
                        <Typography variant="subtitle1">Новый статус:</Typography>
                        <Select
                            value={currentUser.status || UserStatus.ACTIVE}
                            onChange={(e) => setCurrentUser(prev => ({
                                ...prev,
                                status: e.target.value as UserStatus
                            }))}
                            fullWidth
                        >
                            {Object.values(UserStatus).map(status => (
                                <MenuItem key={status} value={status}>
                                    <Chip
                                        label={status}
                                        color={getStatusColor(status)}
                                        size="small"
                                        sx={{ mr: 1 }}
                                    />
                                    {userStatuses.get(status)}
                                </MenuItem>
                            ))}
                        </Select>
                        <Typography variant="subtitle1">Комментарий:</Typography>
                        <TextField
                            name="comment"
                            value={currentUser.statusComment || ''}
                            onChange={(e) => setCurrentUser(prev => ({
                                ...prev,
                                statusComment: e.target.value
                            }))}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Button
                        onClick={() => updateStatus(currentUser.status as UserStatus)}
                        variant="contained"
                    >
                        Обновить статус
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