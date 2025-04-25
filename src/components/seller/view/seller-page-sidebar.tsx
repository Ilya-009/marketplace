import {
    Box,
    List,
    ListItem,
    Typography,
    Divider, TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {ChangeEventHandler} from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { SmallMenuLinkActive } from '../../common';
import {GoodCategory} from "../../../api";

const SidebarContainer = styled(Box)(({ theme }) => ({
    width: 280,
    padding: theme.spacing(2),
    borderRight: `1px solid ${theme.palette.divider}`,
    height: '100%'
}));
const FilterSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3)
}));

type FilterSidebarPriceRange = {
    startRange: number;
    endRange: number;
};

type FilterSidebarProps = {
    categories: GoodCategory[];
    handleMinPriceChange: (event: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleMaxPriceChange: (event: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleHighRatingCheckChange: (checked: boolean) => void;
    priceRange: FilterSidebarPriceRange;
};

const SellerFilterSidebar = ({
                           categories,
                           priceRange,
                           handleMinPriceChange,
                           handleMaxPriceChange,
                           handleHighRatingCheckChange
                       }: FilterSidebarProps) => {
    return (
        <SidebarContainer>
            <FilterSection>
                <Typography variant="h6" gutterBottom>
                    Категория
                </Typography>
                <List sx={{paddingLeft: '.5rem'}}>
                    {categories?.map((category) => (
                        <ListItem disablePadding key={category.id} sx={{marginBottom: '.5rem'}}>
                            <SmallMenuLinkActive href={`/catalog/${category.id}`}>{category.name}</SmallMenuLinkActive>
                        </ListItem>
                    ))}
                </List>
            </FilterSection>
            <Divider sx={{ my: 2 }} />
            <FilterSection>
                <Typography variant="h6" gutterBottom>
                    Цена
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        type="number"
                        value={priceRange.startRange}
                        onChange={handleMinPriceChange}
                        InputProps={{ inputProps: { min: 0, max: priceRange.endRange - 1 } }}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        type="number"
                        value={priceRange.endRange}
                        onChange={handleMaxPriceChange}
                        InputProps={{ inputProps: { min: priceRange.startRange + 1 } }}
                        variant="outlined"
                        fullWidth
                    />
                </Box>
            </FilterSection>
            <Divider sx={{ my: 2 }} />
            <FilterSection>
                <Typography variant="h6" gutterBottom>
                    Рейтинг
                </Typography>
                <FormControlLabel
                    control={<Checkbox />}
                    label="Высокий рейтинг"
                    onChange={(_, checked) => handleHighRatingCheckChange(checked)}
                    sx={{ width: '100%' }}
                />
            </FilterSection>
        </SidebarContainer>
    );
};
export default SellerFilterSidebar;