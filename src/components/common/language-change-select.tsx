import { Select, MenuItem } from '@mui/material';
import {useLanguage} from "../../locales/language-context.tsx";

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'ru' | 'fr')}
        >
            <MenuItem value="ru">Русский | ₽</MenuItem>
            <MenuItem value="en">English | $</MenuItem>
            <MenuItem value="fr">Français | €</MenuItem>
        </Select>
    );
};

export default LanguageSwitcher;