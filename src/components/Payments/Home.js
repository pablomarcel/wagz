import * as React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Grid,
    Card,
    CardContent,
    Box
} from '@mui/material';
import { Link, Routes, Route } from 'react-router-dom';
import HomeActivity from './HomeActivity';
import ActivityTransactions from './ActivityTransactions';
import Subscriptions from './Subscriptions';
import SettingsContactInfo from './SettingsContactInfo';
import HelpPayments from './HelpPayments';
import TermsAndPrivacy from './TermsAndPrivacy';

export default function Home() {
    const listItems = [
        { name: 'Home', route: 'home' },
        { name: 'Activity', route: 'activity' },
        { name: 'Subscriptions', route: 'recurringpayments' },
        { name: 'Settings', route: 'settings' },
        { name: 'Help', route: 'help' },
        { name: 'Terms And Privacy', route: 'termsandprivacy'},
    ];

    return (
        <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'space-around', height: '100vh' }}>
            <Grid item xs={12} sm={6} style={{ minWidth: '400px', display: 'flex', flexDirection: 'column' }}>
                <Card sx={{boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)', backgroundColor: '#f5f5f5', flex: 1}}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Payments
                        </Typography>
                        <List style={{width: '100%', overflow: 'auto'}}>
                            {listItems.map((item, index) => (
                                <ListItem button key={index} component={Link} to={item.route} style={{height: '50px'}}>
                                    <ListItemText primary={item.name} style={{ width: '100%', textAlign: 'Left' }} />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} style={{ minWidth: '400px', display: 'flex', flexDirection: 'column' }}>
                <Card sx={{boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)', backgroundColor: '#f5f5f5', flex: 1}}>
                    <CardContent>
                        <Box maxWidth="400px">
                            <Routes>
                                <Route path="home" element={<HomeActivity />} />
                                <Route path="activity" element={<ActivityTransactions />} />
                                <Route path="recurringpayments" element={<Subscriptions />} />
                                <Route path="settings" element={<SettingsContactInfo />} />
                                <Route path="help" element={<HelpPayments />} />
                                <Route path="termsandprivacy" element={<TermsAndPrivacy />} />
                            </Routes>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
