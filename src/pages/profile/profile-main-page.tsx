import React from 'react';
import {Box, Typography, Card, CardContent, Grid, TextField, Button} from '@mui/material';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell} from 'recharts';
import {EditProfileLink, SidebarPageBox} from "../../components";
import {Link} from "react-router-dom";
import {getMarketplaceType} from "../../services";
import {MarketplaceType} from "../../api";
import {useLanguage} from "../../locales/language-context.tsx";

const COLORS = ['#128a00', '#ff0000'];

const ProfileMainPage: React.FC = () => {
    const marketplaceType = getMarketplaceType();
    const {t} = useLanguage();

    // Данные для графиков
    const purchaseData = [
        {name: t('common.months.jan'), value: 12},
        {name: t('common.months.feb'), value: 19},
        {name: t('common.months.mar'), value: 8},
        {name: t('common.months.apr'), value: 15},
        {name: t('common.months.may'), value: 10},
    ];

    const reviewData = [
        {name: t('customer.profile.myData.stats.reviews.positive'), value: 15},
        {name: t('customer.profile.myData.stats.reviews.negative'), value: 3},
    ];

    return <SidebarPageBox>
        <Typography variant="h5" gutterBottom>
            {t('customer.profile.tabs.personalData')}
        </Typography>

        {/* Карточки с общей информацией */}
        <Grid container spacing={3} sx={{marginBottom: 4}}>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" color="textSecondary">
                            {marketplaceType === MarketplaceType.GOODS
                                ? t('customer.profile.myData.stats.bought.goods')
                                : t('customer.profile.myData.stats.bought.services')
                            }
                        </Typography>
                        <Typography variant="h4">142</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" color="textSecondary">
                            {t('customer.profile.myData.stats.reviews.brief')}
                        </Typography>
                        <Typography variant="h4">23</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" color="textSecondary">
                            {t('customer.profile.myData.stats.orders')}
                        </Typography>
                        <Typography variant="h4">56</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

        {/* Графики */}
        <Grid container spacing={3} sx={{marginBottom: 4}}>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            {t('customer.profile.myData.stats.bought.header')}
                        </Typography>
                        <BarChart width={500} height={300} data={purchaseData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip/>
                            <Bar dataKey="value" fill="#8884d8"/>
                        </BarChart>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            {t('customer.profile.myData.stats.reviews.header')}
                        </Typography>
                        <PieChart width={500} height={300}>
                            <Pie
                                data={reviewData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label
                            >
                                {reviewData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                ))}
                            </Pie>
                            <Tooltip/>
                            <Legend/>
                        </PieChart>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

        {/* Форма применения промокода */}
        {/*<Card sx={{marginBottom: 4}}>*/}
        {/*    <CardContent>*/}
        {/*        <Typography variant="h6" color="textSecondary" gutterBottom>*/}
        {/*            Применить промокод*/}
        {/*        </Typography>*/}
        {/*        <Box component="form" sx={{display: 'flex', gap: 2}}>*/}
        {/*            <TextField fullWidth label="Введите промокод" variant="outlined"/>*/}
        {/*            <Button variant="contained" color="primary">*/}
        {/*                Применить*/}
        {/*            </Button>*/}
        {/*        </Box>*/}
        {/*    </CardContent>*/}
        {/*</Card>*/}

        {/* Условия оплаты и возврата */}
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <EditProfileLink component={Link} to="payment-policy">
                            {t('customer.profile.myData.paymentPolicy')}
                        </EditProfileLink>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <EditProfileLink component={Link} to="return-policy">
                            {t('customer.profile.myData.returnPolicy')}
                        </EditProfileLink>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </SidebarPageBox>;
};

export default ProfileMainPage;