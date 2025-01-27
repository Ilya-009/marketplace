import {useState} from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Divider,
    Typography,
    Stack,
    Grid2,
} from '@mui/material';
import {useUnit} from "effector-react";
import {$categories, GoodCategory} from "../../api";
import styled from "styled-components";
import {SmallMenuLinkActive, SmallMenuLinkPassive} from "../common";

type CatalogProps = {
    isOpen: boolean;
    handleClose: () => void;
};

const CustomCatalogListItem = styled(ListItem)`
    cursor: pointer;
`;

const CategoryCatalog = ({isOpen, handleClose} : CatalogProps) => {
    const categories = useUnit($categories);
    const [selectedCategory, setSelectedCategory] = useState<GoodCategory | undefined>();

    const handleCategoryClick = (category: GoodCategory) => {
        setSelectedCategory(category);
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="xl" sx={{minHeight: 600}}>
            <DialogTitle sx={{color: 'black'}}>Каталог</DialogTitle>
            <DialogContent>
                <Stack direction="row" spacing={2} sx={{color: 'black'}}>
                    <Stack
                        spacing={1}
                        style={{overflowY: 'auto', width: '200px'}}
                    >
                        <List>
                            {categories.map((category) => (
                                <CustomCatalogListItem button key={category.id} onClick={() => handleCategoryClick(category)}>
                                    <ListItemText primary={category.name}/>
                                </CustomCatalogListItem>
                            ))}
                        </List>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack spacing={1} style={{flexGrow: 1}}>
                        {selectedCategory ? (
                            <>
                                <Typography variant="h5" fontWeight={"bold"} gutterBottom>
                                    {selectedCategory.name}
                                </Typography>
                                <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                                    {selectedCategory?.childCategories?.map((childCategory, index) => (
                                        <Grid2 item key={index} size={{ xs: 2, sm: 4, md: 4 }}>
                                            <SmallMenuLinkActive>{childCategory.name}</SmallMenuLinkActive>

                                            {childCategory?.childCategories !== undefined
                                                ?
                                                <List>
                                                    {childCategory?.childCategories.map((category) => (
                                                        <ListItemText>
                                                            <SmallMenuLinkPassive>{category.name}</SmallMenuLinkPassive>
                                                        </ListItemText>
                                                    ))}
                                                </List>
                                                : ''
                                            }
                                        </Grid2>
                                    )) ?? []}
                                </Grid2>
                            </>
                        ) : ''}
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryCatalog;
