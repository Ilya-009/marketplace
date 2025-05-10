import {Property, SettingType} from "../../../api";
import {Avatar, Box, Button, MenuItem, Select, Switch, TextField} from "@mui/material";
import {Image} from "@mui/icons-material";
import FormControlLabel from "@mui/material/FormControlLabel";
import {MuiColorInput} from "mui-color-input";
import {getImagePropertyValue} from "../../../services";

export const renderValueDisplay = (property: Property) => {
    switch (property.settingType) {
        case SettingType.BOOLEAN:
            return property.value === 'true' ? 'Да' : 'Нет';
        case SettingType.IMAGE:
            return property.fileName ? (
                <Box display="flex" alignItems="center">
                    <Avatar
                        src={getImagePropertyValue(property)}
                        variant="rounded"
                        sx={{ width: 40, height: 40, mr: 1 }}
                    >
                        <Image />
                    </Avatar>
                    {property.fileName}
                </Box>
            ) : 'Файл не загружен';
        case SettingType.COLOR:
            return (
                <Box display="flex" alignItems="center">
                    <Box
                        sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: property.value,
                            border: '1px solid #ccc',
                            mr: 1
                        }}
                    />
                    {property.value}
                </Box>
            );
        default:
            return property.value;
    }
};

export const renderEditControl = (property: Property, handleValueChange: (value: string) => void) => {
    switch (property.settingType) {
        case SettingType.BOOLEAN:
            return (
                <FormControlLabel
                    control={
                        <Switch checked={property.value === 'true'}
                                onChange={(e) => handleValueChange(e.target.checked ? 'true' : 'false')}
                        />
                    }
                    label={property.value === 'true' ? 'Да' : 'Нет'}
                />
            );
        case SettingType.SELECT:
            return (
                <Select
                    value={property.value}
                    onChange={(e) => handleValueChange(e.target.value as string)}
                    fullWidth
                >
                    {property.allowedValues?.map(value => (
                        <MenuItem key={value} value={value}>{value}</MenuItem>
                    ))}
                </Select>
            );
        case SettingType.IMAGE:
            return (
                <Box>
                    {property.value && (
                        <Box mb={2}>
                            <Avatar
                                src={property.value}
                                variant="rounded"
                                sx={{ width: 80, height: 80 }}
                            />
                        </Box>
                    )}
                    <Button
                        variant="contained"
                        component="label"
                    >
                        Загрузить файл
                        <input
                            type="file"
                            hidden
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    // Здесь должна быть логика загрузки файла
                                    const file = e.target.files[0];
                                    handleValueChange(URL.createObjectURL(file));
                                }
                            }}
                        />
                    </Button>
                </Box>
            );
        case SettingType.COLOR:
            return (
                <Box display="flex" alignItems="center">
                    <MuiColorInput format="hex"
                                   value={property.value}
                                   onChange={(e) => handleValueChange(e)}/>
                </Box>
            );
        default:
            return (
                <TextField
                    value={property.value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    fullWidth
                    type={property.settingType === SettingType.NUMBER ? 'number' : 'text'}
                />
            );
    }
};
