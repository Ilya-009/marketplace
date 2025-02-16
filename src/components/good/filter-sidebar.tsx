import {
    Box,
    List,
    ListItem,
    Typography,
    Divider, TextField, SelectChangeEvent
} from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { styled } from '@mui/material/styles';
import {$categories, findParentCategory, GoodCategory} from "../../api";
import {useUnit} from "effector-react";
import {BackwardLink, SmallMenuLinkActive} from "../common";
import {ChangeEventHandler} from "react";

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
    goodCategory?: GoodCategory;
    handleMinPriceChange: (event: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleMaxPriceChange: (event: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) => void;
    priceRange: FilterSidebarPriceRange;
};

const FilterSidebar = ({goodCategory, priceRange, handleMinPriceChange, handleMaxPriceChange}: FilterSidebarProps) => {
    const categories = useUnit($categories);
    const parentCategory = findParentCategory(categories, goodCategory?.id as number);

    return (
        <SidebarContainer>
            <FilterSection>
                <Typography variant="h6" gutterBottom>
                    Категория
                </Typography>
                {findParentCategory(categories, goodCategory?.id as number) != null
                    ? <BackwardLink href={`/catalog/${parentCategory?.id}`}>
                        <ArrowLeftIcon/>
                        {parentCategory?.name}
                    </BackwardLink>
                    : <Typography gutterBottom>{parentCategory?.name}</Typography>}
                {parentCategory != null ? (
                    <BackwardLink href={`/catalog/${parentCategory?.id}`}>
                        <ArrowLeftIcon/>
                        {goodCategory?.name}
                    </BackwardLink>
                ) : <Typography gutterBottom>{goodCategory?.name}</Typography>}
                <List sx={{paddingLeft: '.5rem'}}>
                    {goodCategory?.childCategories?.map((category) => (
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
                {/*<List disablePadding>*/}
                {/*    <ListItem disablePadding>*/}
                {/*        <FormControlLabel*/}
                {/*            control={<Checkbox />}*/}
                {/*            label="4★ и выше"*/}
                {/*            sx={{ width: '100%' }}*/}
                {/*        />*/}
                {/*    </ListItem>*/}
                {/*    <ListItem disablePadding>*/}
                {/*        <FormControlLabel*/}
                {/*            control={<Checkbox />}*/}
                {/*            label="3★ и выше"*/}
                {/*            sx={{ width: '100%' }}*/}
                {/*        />*/}
                {/*    </ListItem>*/}
                {/*</List>*/}
            </FilterSection>
        </SidebarContainer>
    );
};
export default FilterSidebar;