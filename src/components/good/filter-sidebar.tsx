import {
    Box,
    List,
    ListItem,
    Typography,
    Divider
} from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { styled } from '@mui/material/styles';
import {$categories, GoodCategory} from "../../api";
import {useUnit} from "effector-react";
import {useMemo} from "react";
import {BackwardLink, SmallMenuLinkActive} from "../common";

const SidebarContainer = styled(Box)(({ theme }) => ({
    width: 280,
    padding: theme.spacing(2),
    borderRight: `1px solid ${theme.palette.divider}`,
    height: '100%'
}));
const FilterSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3)
}));

type FilterSidebarProps = {
    goodCategory?: GoodCategory;
};

const findParentCategoryForSelected = (categories: GoodCategory[], search?: GoodCategory) => {
    return categories.find(category => category.childCategories?.some(subCategory => subCategory.id === search?.id));
};

const FilterSidebar = ({goodCategory}: FilterSidebarProps) => {
    const categories = useUnit($categories);

    const parentCategory = useMemo(() => findParentCategoryForSelected(categories, goodCategory),
        [categories, goodCategory?.id]);
    console.log(categories, goodCategory);

    return (
        <SidebarContainer>
            <FilterSection>
                <Typography variant="h6" gutterBottom>
                    Категория
                </Typography>
                {findParentCategoryForSelected(categories, parentCategory) != null
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
                {/*<List disablePadding>*/}
                {/*    <ListItem disablePadding>*/}
                {/*        <FormControlLabel*/}
                {/*            control={<Checkbox />}*/}
                {/*            label="Under ₽1000"*/}
                {/*            sx={{ width: '100%' }}*/}
                {/*        />*/}
                {/*    </ListItem>*/}
                {/*    <ListItem disablePadding>*/}
                {/*        <FormControlLabel*/}
                {/*            control={<Checkbox />}*/}
                {/*            label="₽1000 - ₽5000"*/}
                {/*            sx={{ width: '100%' }}*/}
                {/*        />*/}
                {/*    </ListItem>*/}
                {/*    <ListItem disablePadding>*/}
                {/*        <FormControlLabel*/}
                {/*            control={<Checkbox />}*/}
                {/*            label="Over ₽5000"*/}
                {/*            sx={{ width: '100%' }}*/}
                {/*        />*/}
                {/*    </ListItem>*/}
                {/*</List>*/}
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