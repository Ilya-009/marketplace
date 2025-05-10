import React, {useState, useEffect} from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import {Edit, Delete, Add} from '@mui/icons-material';
import {useUnit} from "effector-react";
import {$customer} from "../../api";
import {$addresses, Address, emptyAddress, loadAddresses} from "../../api";

const AddressTable: React.FC = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [editAddress, setEditAddress] = useState<Address | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const customer = useUnit($customer);
    const customerAddresses = useUnit($addresses);

    useEffect(() => {
        if (customer.id > 0) {
            loadAddresses({addressIds: customer.addresses});
        }
    }, [customer.addresses, customer.id]);

    useEffect(() => {
        setAddresses(customerAddresses);
    }, [customerAddresses]);

    const handleEdit = (address: Address) => {
        setEditAddress(address);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        // await deleteAddressFromApi(id);
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    };

    const handleAddNew = () => {
        setEditAddress(emptyAddress);
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (editAddress) {
            // await saveAddressToApi(editAddress);
            // TODO: Добавить вызов API для сохранения
            if (editAddress.id === 0) {
                // Новый адрес
                setAddresses((prev) => [...prev, {...editAddress, id: prev.length + 1}]);
            } else {
                // Редактирование существующего адреса
                setAddresses((prev) =>
                    prev.map((addr) => (addr.id === editAddress.id ? editAddress : addr))
                );
            }
            setIsDialogOpen(false);
            setEditAddress(null);
        }
    };

    const handleCancel = () => {
        setIsDialogOpen(false);
        setEditAddress(null);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setEditAddress((prev) =>
            prev ? {...prev, [name]: value} : null
        );
    };

    return (
        <Box sx={{width: '85%'}}>
            <Typography variant="h4" gutterBottom>
                Управление адресами доставки
            </Typography>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" startIcon={<Add/>} onClick={handleAddNew}>
                    Добавить новый адрес
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Страна</TableCell>
                            <TableCell>Город</TableCell>
                            <TableCell>Улица</TableCell>
                            <TableCell>Дом</TableCell>
                            <TableCell>Подъезд</TableCell>
                            <TableCell>Квартира</TableCell>
                            <TableCell>Индекс</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {addresses.map((address) => (
                            <TableRow key={address.id}>
                                <TableCell>{address.country}</TableCell>
                                <TableCell>{address.city}</TableCell>
                                <TableCell>{address.street}</TableCell>
                                <TableCell>{address.houseNumber}</TableCell>
                                <TableCell>{address.entranceNumber}</TableCell>
                                <TableCell>{address.flatNumber}</TableCell>
                                <TableCell>{address.postNumber}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(address)}>
                                        <Edit/>
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(address.id)} color="error">
                                        <Delete/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={isDialogOpen} onClose={handleCancel}>
                <DialogTitle>{editAddress?.id ? 'Редактирование адреса' : 'Добавление нового адреса'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Страна"
                        name="country"
                        value={editAddress?.country || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Город"
                        name="city"
                        value={editAddress?.city || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Улица"
                        name="street"
                        value={editAddress?.street || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Дом"
                        name="houseNumber"
                        value={editAddress?.houseNumber || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Подъезд"
                        name="entranceNumber"
                        value={editAddress?.entranceNumber || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Квартира"
                        name="flatNumber"
                        value={editAddress?.flatNumber || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Индекс"
                        name="postNumber"
                        value={editAddress?.postNumber || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Отмена</Button>
                    <Button onClick={handleSave} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddressTable;